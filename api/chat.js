"use strict";

const GEMINI_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
];
const REQUEST_TIMEOUT_MS = 20000;
const ALLOWED_ORIGINS = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

const SYSTEM_PROMPT = [
    "You are iHealth AI Coach, a friendly coach for exercise, diet, health check data, and corporate wellness management.",
    "Use the provided RAG context only. Do not infer private data that is not present.",
    "For employee mode, address the user only by displayName. Never use Chinese personal names.",
    "For enterprise mode, use anonymous aggregate statistics only. Never mention employee names, employee IDs, individual records, or identifiable details.",
    "Stay warm, professional, concrete, and actionable.",
    "Keep every answer under 400 Chinese characters or an equivalent short English length.",
    "Do not use Markdown syntax. Do not use markdown headings, bullets, tables, bold, asterisks, or code formatting.",
    "If the user asks outside exercise, health, diet, health check data, or corporate wellness management, politely say your expertise is health and exercise advice, then guide them back to a health-related question.",
    "Every answer must briefly state that the advice is for health management reference only and that abnormal values or symptoms should be discussed with a physician, dietitian, or qualified healthcare professional.",
    "Do not diagnose disease, prescribe medication, or claim to cure disease.",
    "If the user asks in English, reply in English. Otherwise, always reply in traditional Chinese."
].join("\n");

module.exports = async function handler(request, response) {
    applyCorsHeaders(request, response);

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }

    if (request.method !== "POST") {
        response.status(405).json({ error: "Method not allowed." });
        return;
    }

    try {
        const payload = parseBody(request.body);
        const message = typeof payload.message === "string" ? payload.message.trim() : "";
        const role = payload.role;
        const context = payload.context;

        if (!message) {
            response.status(400).json({ error: "請先輸入想詢問的健康問題。" });
            return;
        }

        if (!["employee", "enterprise"].includes(role)) {
            response.status(400).json({ error: "登入狀態不完整，請重新登入後再試。" });
            return;
        }

        if (!context || typeof context !== "object") {
            response.status(400).json({ error: "目前沒有可用的健康資料摘要，請重新整理後再試。" });
            return;
        }

        if (!process.env.GEMINI_API_KEY) {
            response.status(503).json({ error: "Gemini API key 尚未設定。請在後端服務的環境變數設定 GEMINI_API_KEY。" });
            return;
        }

        const result = await generateWithFallback(buildUserPrompt(role, message, context));
        response.status(200).json(result);
    } catch (error) {
        console.error("[api/chat] Unexpected error", error);
        response.status(500).json({ error: "AI Coach 暫時無法回覆，請稍後再試。" });
    }
};

function parseBody(body) {
    if (!body) return {};
    if (typeof body === "string") return JSON.parse(body);
    return body;
}

function buildUserPrompt(role, message, context) {
    return [
        `Current role: ${role}`,
        "Relevant RAG context JSON:",
        JSON.stringify(context),
        "User question:",
        message,
        "Answer now."
    ].join("\n");
}

async function generateWithFallback(prompt) {
    let lastError = null;

    for (const model of GEMINI_MODELS) {
        try {
            const reply = await callGemini(model, prompt);
            console.info(`[chatbot] model=${model} status=success`);
            return {
                model,
                reply: finalizeReply(reply)
            };
        } catch (error) {
            lastError = error;
            const retryable = isRetryableGeminiError(error);
            console.warn(`[chatbot] model=${model} status=failed retryable=${retryable} reason=${error.message}`);
            if (!retryable) break;
        }
    }

    throw lastError || new Error("Gemini request failed.");
}

async function callGemini(model, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const geminiResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.45,
                    maxOutputTokens: 512,
                    candidateCount: 1
                }
            })
        });

        const rawText = await geminiResponse.text();
        const parsed = rawText ? JSON.parse(rawText) : {};

        if (!geminiResponse.ok) {
            const error = new Error(parsed?.error?.message || `Gemini API request failed with HTTP ${geminiResponse.status}.`);
            error.status = geminiResponse.status;
            error.code = parsed?.error?.status;
            throw error;
        }

        const text = parsed?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!text) {
            throw new Error("Gemini returned an empty response.");
        }

        return text;
    } catch (error) {
        if (error.name === "AbortError") {
            const timeoutError = new Error("Gemini request timeout.");
            timeoutError.retryable = true;
            throw timeoutError;
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function isRetryableGeminiError(error) {
    const message = String(error.message || "").toLowerCase();
    return Boolean(
        error.retryable ||
        error.status === 429 ||
        error.status >= 500 ||
        error.code === "RESOURCE_EXHAUSTED" ||
        message.includes("resource_exhausted") ||
        message.includes("quota") ||
        message.includes("rate limit") ||
        message.includes("timeout")
    );
}

function finalizeReply(reply) {
    const disclaimer = "建議僅供健康管理參考，若有異常或不適請諮詢醫師、營養師或專業醫療人員。";
    let text = stripMarkdown(reply);

    if (!text.includes("僅供健康管理參考")) {
        const budget = 400 - disclaimer.length - 1;
        text = `${text.slice(0, Math.max(0, budget)).trim()} ${disclaimer}`.trim();
    }

    return text.slice(0, 400).trim();
}

function stripMarkdown(text) {
    return String(text || "")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/\|/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function applyCorsHeaders(request, response) {
    const origin = request.headers.origin;
    const allowedOrigin = getAllowedOrigin(origin);
    if (!allowedOrigin) return;

    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Vary", "Origin");
}

function getAllowedOrigin(origin) {
    if (!origin) return "*";
    if (ALLOWED_ORIGINS.length === 0) return origin;
    return ALLOWED_ORIGINS.includes(origin) ? origin : "";
}

function parseAllowedOrigins(value) {
    return String(value || "")
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean);
}
