"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ALLOWED_ORIGINS = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite"
];
const MAX_REQUEST_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 20000;

const SYSTEM_PROMPT = [
    "You are iHealth AI Coach, a friendly coach for exercise, diet, health check data, and corporate wellness management.",
    "Use the provided RAG context only. Do not infer private data that is not present.",
    "For employee mode, address the user only by displayName. Never use Chinese personal names.",
    "For enterprise mode, use anonymous aggregate statistics only. Never mention employee names, employee IDs, individual records, or identifiable details.",
    "Stay warm, professional, concrete, and actionable.",
    "Write the main coaching answer in 260 to 330 traditional Chinese characters when possible, leaving room for a final safety note appended by the server.",
    "Do not use Markdown syntax. Do not use markdown headings, bullets, tables, bold, asterisks, or code formatting.",
    "Use compact natural paragraphs or plain numbered sentences like 1. 2. 3. only.",
    "If the user asks for a gym workout, training plan, fitness menu, or exercise routine, include warm-up, strength training with sets and reps, cardio or mobility, weekly frequency, and intensity guidance.",
    "For workout-menu questions, do not greet the user. Output exactly four short sentences beginning with 暖身：, 主訓練：, 有氧：, 頻率：. Keep the main answer under 220 traditional Chinese characters.",
    "Make the advice specific enough to execute today. Avoid vague openings that do not contain a complete recommendation.",
    "If the user asks outside exercise, health, diet, health check data, or corporate wellness management, politely say your expertise is health and exercise advice, then guide them back to a health-related question.",
    "Do not write a disclaimer. The server will append the safety note.",
    "Do not diagnose disease, prescribe medication, or claim to cure disease.",
    "If the user asks in English, reply in English. Otherwise, always reply in traditional Chinese."
].join("\n");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const server = http.createServer(async (request, response) => {
    try {
        if (request.url === "/api/chat") {
            applyCorsHeaders(request, response);
        }

        if (request.method === "OPTIONS" && request.url === "/api/chat") {
            response.writeHead(204);
            response.end();
            return;
        }

        if (request.method === "POST" && request.url === "/api/chat") {
            await handleChatRequest(request, response);
            return;
        }

        if (request.method === "GET" || request.method === "HEAD") {
            await serveStaticFile(request, response);
            return;
        }

        sendJson(response, 405, { error: "Method not allowed." });
    } catch (error) {
        console.error("[server] Unexpected error", error);
        sendJson(response, 500, { error: "伺服器暫時無法處理請求，請稍後再試。" });
    }
});

server.listen(PORT, HOST, () => {
    console.info(`[server] iHealth app listening on http://${HOST}:${PORT}`);
});

async function handleChatRequest(request, response) {
    const payload = await readJsonBody(request);
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const role = payload.role;
    const context = payload.context;

    if (!message) {
        sendJson(response, 400, { error: "請先輸入想詢問的健康問題。" });
        return;
    }

    if (!["employee", "enterprise"].includes(role)) {
        sendJson(response, 400, { error: "登入狀態不完整，請重新登入後再試。" });
        return;
    }

    if (!context || typeof context !== "object") {
        sendJson(response, 400, { error: "目前沒有可用的健康資料摘要，請重新整理後再試。" });
        return;
    }

    if (!GEMINI_API_KEY) {
        sendJson(response, 503, { error: "Gemini API key 尚未設定。請在 .env 設定 GEMINI_API_KEY 後重新啟動伺服器。" });
        return;
    }

    const prompt = buildUserPrompt(role, message, context);
    const result = await generateWithFallback(prompt);
    sendJson(response, 200, {
        reply: result.reply,
        model: result.model
    });
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
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
                    maxOutputTokens: 768,
                    candidateCount: 1,
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            })
        });

        const rawText = await response.text();
        const parsed = rawText ? JSON.parse(rawText) : {};

        if (!response.ok) {
            const error = new Error(getGeminiErrorMessage(parsed, response.status));
            error.status = response.status;
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

function getGeminiErrorMessage(payload, status) {
    return payload?.error?.message || `Gemini API request failed with HTTP ${status}.`;
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
    let text = removeExistingDisclaimer(stripMarkdown(reply));
    const budget = 400 - disclaimer.length - 1;

    text = trimToSentence(text, budget);

    return `${text} ${disclaimer}`.trim().slice(0, 400).trim();
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

function removeExistingDisclaimer(text) {
    return text
        .replace(/Disclaimer\s*\(Required\)\s*:\s*/gi, "")
        .replace(/本?建議僅供健康管理參考[，,].*?(醫療人員|專業人員)。?/g, "")
        .replace(/若有異常或不適請諮詢醫師、營養師或專業醫療人員。?/g, "")
        .trim();
}

function trimToSentence(text, maxLength) {
    if (text.length <= maxLength) return text;

    const clipped = text.slice(0, maxLength);
    const sentenceEnd = Math.max(
        clipped.lastIndexOf("。"),
        clipped.lastIndexOf("！"),
        clipped.lastIndexOf("？"),
        clipped.lastIndexOf(".")
    );

    if (sentenceEnd >= Math.floor(maxLength * 0.55)) {
        return clipped.slice(0, sentenceEnd + 1).trim();
    }

    return clipped.trim();
}

async function serveStaticFile(request, response) {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(__dirname, relativePath);
    const pathParts = relativePath.split(/[\\/]/);

    if (
        !filePath.startsWith(__dirname) ||
        pathParts.some(part => part.startsWith(".")) ||
        ["server.js", "package.json"].includes(relativePath)
    ) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    let stat;
    try {
        stat = await fs.promises.stat(filePath);
    } catch {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    if (stat.isDirectory()) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
        "Cache-Control": "no-store"
    });

    if (request.method === "HEAD") {
        response.end();
        return;
    }

    fs.createReadStream(filePath).pipe(response);
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let size = 0;
        let body = "";

        request.on("data", chunk => {
            size += chunk.length;
            if (size > MAX_REQUEST_BYTES) {
                reject(new Error("Request body too large."));
                request.destroy();
                return;
            }
            body += chunk;
        });

        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON body."));
            }
        });

        request.on("error", reject);
    });
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(payload));
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

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, "utf8");
    content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) return;

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    });
}
