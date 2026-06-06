"use strict";

const HEALTH_DATA_URL = "data/processed/ihealth_employee_health.json";
const CHAT_API_URL = "/api/chat";

function googleMapsUrl(query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const database = {
    companies: [
        { companyId: "C001", name: "永續科技股份有限公司", industry: "科技服務", employeeCount: 6 }
    ],
    userAccounts: [
        { accountId: "E001", password: "1234", role: "employee", employeeId: "E001", companyId: "C001" },
        { accountId: "E002", password: "1234", role: "employee", employeeId: "E002", companyId: "C001" },
        { accountId: "E003", password: "1234", role: "employee", employeeId: "E003", companyId: "C001" },
        { accountId: "CORP001", password: "admin123", role: "enterprise", companyId: "C001" }
    ],
    employeeInfo: [
        { employeeId: "E001", name: "王小明", gender: "M", age: 46, department: "營運部", companyId: "C001", freeClasses: 2 },
        { employeeId: "E002", name: "林雅婷", gender: "F", age: 38, department: "財務部", companyId: "C001", freeClasses: 1 },
        { employeeId: "E003", name: "陳志豪", gender: "M", age: 52, department: "工程部", companyId: "C001", freeClasses: 3 },
        { employeeId: "E004", name: "黃品蓁", gender: "F", age: 31, department: "人資部", companyId: "C001", freeClasses: 1 },
        { employeeId: "E005", name: "張育仁", gender: "M", age: 44, department: "業務部", companyId: "C001", freeClasses: 2 },
        { employeeId: "E006", name: "蔡佳容", gender: "F", age: 49, department: "營運部", companyId: "C001", freeClasses: 2 }
    ],
    healthCheckRecords: [
        { employeeId: "E001", year: 2024, waist: 99, bpS: 139, bpD: 86, glucose: 112, tg: 168, hdl: 42, bmi: 30.1 },
        { employeeId: "E001", year: 2025, waist: 97, bpS: 136, bpD: 84, glucose: 108, tg: 152, hdl: 44, bmi: 29.8 },
        { employeeId: "E001", year: 2026, waist: 95, bpS: 135, bpD: 82, glucose: 105, tg: 140, hdl: 45, bmi: 29.4 },
        { employeeId: "E002", year: 2024, waist: 78, bpS: 116, bpD: 74, glucose: 88, tg: 102, hdl: 60, bmi: 23.2 },
        { employeeId: "E002", year: 2025, waist: 80, bpS: 117, bpD: 76, glucose: 91, tg: 111, hdl: 59, bmi: 24.1 },
        { employeeId: "E002", year: 2026, waist: 82, bpS: 118, bpD: 76, glucose: 92, tg: 118, hdl: 58, bmi: 24.8 },
        { employeeId: "E003", year: 2024, waist: 96, bpS: 134, bpD: 86, glucose: 113, tg: 156, hdl: 39, bmi: 29.8 },
        { employeeId: "E003", year: 2025, waist: 99, bpS: 138, bpD: 88, glucose: 121, tg: 172, hdl: 37, bmi: 30.5 },
        { employeeId: "E003", year: 2026, waist: 101, bpS: 142, bpD: 91, glucose: 128, tg: 188, hdl: 36, bmi: 31.2 },
        { employeeId: "E004", year: 2024, waist: 74, bpS: 110, bpD: 70, glucose: 89, tg: 96, hdl: 66, bmi: 21.7 },
        { employeeId: "E004", year: 2025, waist: 73, bpS: 109, bpD: 69, glucose: 87, tg: 93, hdl: 67, bmi: 21.4 },
        { employeeId: "E004", year: 2026, waist: 72, bpS: 108, bpD: 68, glucose: 86, tg: 91, hdl: 67, bmi: 21.3 },
        { employeeId: "E005", year: 2024, waist: 88, bpS: 128, bpD: 82, glucose: 96, tg: 143, hdl: 46, bmi: 25.6 },
        { employeeId: "E005", year: 2025, waist: 90, bpS: 130, bpD: 84, glucose: 99, tg: 150, hdl: 44, bmi: 26.1 },
        { employeeId: "E005", year: 2026, waist: 91, bpS: 132, bpD: 86, glucose: 101, tg: 158, hdl: 43, bmi: 26.5 },
        { employeeId: "E006", year: 2024, waist: 84, bpS: 126, bpD: 78, glucose: 94, tg: 132, hdl: 52, bmi: 25.2 },
        { employeeId: "E006", year: 2025, waist: 85, bpS: 129, bpD: 82, glucose: 98, tg: 146, hdl: 50, bmi: 25.8 },
        { employeeId: "E006", year: 2026, waist: 87, bpS: 131, bpD: 85, glucose: 103, tg: 162, hdl: 48, bmi: 26.4 }
    ],
    healthBenefits: [
        {
            benefitId: "B001",
            category: "🥗 健康飲食",
            name: "低 GI 健康餐盒",
            description: "憑員工證享全品項 85 折，適合血糖與三酸甘油脂需控管者。",
            stores: [
                { name: "蛋白盒子健康低卡餐盒-中壢民族店", url: "https://maps.app.goo.gl/hz44oPFtaLbMbdyv7?g_st=ic" },
                { name: "蛋白盒子健康低卡餐盒-中壢中原店", url: googleMapsUrl("蛋白盒子健康低卡餐盒 中壢中原店") },
                { name: "SWG Meal 健康餐盒", url: googleMapsUrl("SWG Meal 健康餐盒 桃園市中壢區領航南路四段15號") }
            ]
        },
        {
            benefitId: "B002",
            category: "🥗 健康飲食",
            name: "營養師飲食諮詢",
            description: "每月 2 次 30 分鐘營養諮詢，依健檢數據調整飲食目標。",
            stores: [
                { name: "桃園市政府中壢區衛生所", url: googleMapsUrl("桃園市政府中壢區衛生所 桃園市中壢區溪洲街296號") },
                { name: "中壢天晟醫院營養諮詢", url: googleMapsUrl("中壢天晟醫院 桃園市中壢區延平路155號") },
                { name: "敦仁診所", url: googleMapsUrl("敦仁診所 桃園市中壢區忠孝路18號") }
            ]
        },
        {
            benefitId: "B003",
            category: "🏋️ 運動健身",
            name: "公司合作健身房",
            description: "享年費優惠，並提供減脂與阻力訓練課程體驗。",
            stores: [
                { name: "桃園市中壢國民運動中心", url: googleMapsUrl("桃園市中壢國民運動中心 桃園市中壢區三光路350號") },
                { name: "World Gym 世界健身俱樂部 中壢中原店", url: googleMapsUrl("World Gym 中壢中原店") },
                { name: "GK成吉思汗健身俱樂部 中壢館", url: googleMapsUrl("GK成吉思汗健身俱樂部 中壢館") }
            ]
        },
        {
            benefitId: "B004",
            category: "🏋️ 運動健身",
            name: "有氧課程合作",
            description: "每週二、四下班後開課，適合血壓、血糖與 HDL 風險族群。",
            stores: [
                { name: "桃園市中壢國民運動中心", url: googleMapsUrl("桃園市中壢國民運動中心 桃園市中壢區三光路350號") },
                { name: "World Gym 世界健身俱樂部 中壢中原店", url: googleMapsUrl("World Gym 中壢中原店 有氧課程") },
                { name: "EDS擁抱舞蹈工作室", url: googleMapsUrl("EDS擁抱舞蹈工作室 桃園市中壢區環中東路二段286號") }
            ]
        },
        {
            benefitId: "B007",
            category: "👩‍🏫 公司課程",
            name: "內部免費課程",
            description: "目前公司內部有開設的多種免費課程，歡迎踴躍參加，點擊課程可查看詳細資訊。更多內容請洽廠護(分機#1123)",
            type: "courses"
        },
        {
            benefitId: "B005",
            category: "🧘 壓力支持",
            name: "EAP 員工協助方案",
            description: "提供壓力、睡眠與生活型態諮詢，支援長工時與高血壓族群。",
            stores: [
                { name: "新晴心理諮商所", url: googleMapsUrl("新晴心理諮商所 桃園市中壢區中北路二段119號") },
                { name: "芯明心理治療所", url: googleMapsUrl("芯明心理治療所 桃園市中壢區青峰路一段53號") },
                { name: "日暖微光心理諮商所", url: googleMapsUrl("日暖微光心理諮商所 桃園市中壢區中央西路二段281號") }
            ]
        },
        {
            benefitId: "B006",
            category: "📈 健康追蹤",
            name: "血壓自主管理站",
            description: "辦公室固定點量測，資料只回饋本人，企業端僅看匿名統計。",
            stores: [
                { name: "桃園市政府中壢區衛生所", url: googleMapsUrl("桃園市政府中壢區衛生所 桃園市中壢區溪洲街296號") },
                { name: "南區老人文康活動中心", url: googleMapsUrl("南區老人文康活動中心 桃園市中壢區林森路90號") },
                { name: "過嶺社區發展協會", url: googleMapsUrl("過嶺社區發展協會 桃園市中壢區雙福路9號") }
            ]
        }
    ],
    exerciseCourses: [
        {
            courseId: "C101",
            name: "阻力訓練與減脂課",
            coach: "李教練",
            focus: "waist,hdl,tg",
            schedule: "週三 18:30 / 週五 19:00",
            capacity: 16,
            description: "以循環式肌力與核心訓練提升基礎代謝，協助腰圍管理與體脂控制。",
            duration: "60 分鐘",
            location: "B1 體適能教室"
        },
        {
            courseId: "C102",
            name: "血糖友善有氧方案",
            coach: "周教練",
            focus: "glucose,bp,hdl",
            schedule: "週二 18:20 / 週四 18:20",
            capacity: 20,
            description: "以中低強度有氧搭配間歇節奏，幫助穩定血糖、改善心肺與血壓控制。",
            duration: "45 分鐘",
            location: "6F 有氧教室"
        },
        {
            courseId: "C103",
            name: "營養師餐盤調整課",
            coach: "陳營養師",
            focus: "glucose,tg,waist",
            schedule: "週一 12:30 / 週四 17:30",
            capacity: 12,
            description: "從日常餐盤比例、外食選擇與點心替換切入，建立更適合代謝管理的飲食習慣。",
            duration: "50 分鐘",
            location: "3F 營養諮詢室"
        },
        {
            courseId: "C104",
            name: "午休正念伸展",
            coach: "黃老師",
            focus: "bp",
            schedule: "週一、三、五 12:10",
            capacity: 24,
            description: "透過呼吸練習、肩頸放鬆與低強度伸展，協助降低午間壓力並恢復專注。",
            duration: "30 分鐘",
            location: "5F 瑜伽教室"
        }
    ],
    courseBookings: [
        { bookingId: "BK001", employeeId: "E001", courseId: "C101", status: "confirmed" },
        { bookingId: "BK002", employeeId: "E003", courseId: "C102", status: "confirmed" },
        { bookingId: "BK003", employeeId: "E003", courseId: "C103", status: "confirmed" },
        { bookingId: "BK004", employeeId: "E005", courseId: "C101", status: "confirmed" },
        { bookingId: "BK005", employeeId: "E006", courseId: "C104", status: "confirmed" }
    ]
};

const riskRules = [
    { key: "waist", label: "腰圍 (cm)", getValue: (record) => record.waist, isRisk: (employee, record) => employee.gender === "M" ? record.waist >= 90 : record.waist >= 80 },
    { key: "bp", label: "血壓 (mmHg)", getValue: (record) => `${record.bpS}/${record.bpD}`, isRisk: (employee, record) => record.bpS >= 130 || record.bpD >= 85 },
    { key: "glucose", label: "空腹血糖 (mg/dL)", getValue: (record) => record.glucose, isRisk: (employee, record) => record.glucose >= 100 },
    { key: "tg", label: "三酸甘油酯 (mg/dL)", getValue: (record) => record.tg, isRisk: (employee, record) => record.tg >= 150 },
    { key: "hdl", label: "HDL膽固醇", getValue: (record) => record.hdl, isRisk: (employee, record) => employee.gender === "M" ? record.hdl < 40 : record.hdl < 50 }
];

let selectedRole = "employee";
let currentSession = null;
let currentEmployee = null;
let selectedEmployeeYear = null;
let selectedCompanyYear = null;
let selectedCompanyGender = "all";
let selectedCompanyAgeGroup = "all";
let chatbotLoadingMessage = null;

document.addEventListener("DOMContentLoaded", async () => {
    await loadExternalHealthData();
    bindAuth();
    bindNavigation();
    bindModal();
    bindYearFilters();
    bindChatbot();
    renderBenefits();
});

async function loadExternalHealthData() {
    try {
        const response = await fetch(HEALTH_DATA_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        applyExternalHealthData(payload);
        console.info("Loaded health data", payload.metadata);
    } catch (error) {
        console.warn("External health data was not loaded; using built-in demo data.", error);
    }
}

function applyExternalHealthData(payload) {
    if (!payload || !Array.isArray(payload.employeeInfo) || !Array.isArray(payload.healthCheckRecords) || !Array.isArray(payload.userAccounts)) {
        throw new Error("Invalid health data payload");
    }

    database.employeeInfo = payload.employeeInfo.map(employee => ({
        employeeId: employee.employeeId,
        name: employee.name,
        englishName: employee.englishName,
        gender: employee.gender,
        age: Number(employee.age),
        department: employee.department,
        companyId: employee.companyId,
        freeClasses: Number(employee.freeClasses),
        sourceSeqns: employee.sourceSeqns
    }));

    database.healthCheckRecords = payload.healthCheckRecords.map(record => ({
        recordId: record.recordId,
        employeeId: record.employeeId,
        year: Number(record.year),
        waist: Number(record.waist),
        bpS: Number(record.bpS),
        bpD: Number(record.bpD),
        glucose: Number(record.glucose),
        tg: Number(record.tg),
        hdl: Number(record.hdl),
        bmi: Number(record.bmi),
        sourceSeqn: record.sourceSeqn,
        metabolicSyndrome: Number(record.metabolicSyndrome),
        bpSource: record.bpSource
    }));

    database.userAccounts = payload.userAccounts.map(account => ({
        accountId: account.accountId,
        password: account.password,
        role: account.role,
        employeeId: account.employeeId,
        companyId: account.companyId
    }));

    database.companies = database.companies.map(company => ({
        ...company,
        employeeCount: database.employeeInfo.filter(employee => employee.companyId === company.companyId).length
    }));
}

function bindAuth() {
    document.querySelectorAll(".role-card").forEach(button => {
        button.addEventListener("click", () => {
            selectedRole = button.dataset.role;
            document.querySelectorAll(".role-card").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            updateAuthHint();
        });
    });

    document.getElementById("authForm").addEventListener("submit", event => {
        event.preventDefault();
        handleAuthLogin();
    });

    document.getElementById("logoutBtn").addEventListener("click", logout);
}

function bindNavigation() {
    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("logo") && currentSession?.role === "enterprise") {
                showPage("company-page");
                return;
            }
            showPage(button.dataset.page);
        });
    });
}

function bindModal() {
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    window.addEventListener("click", event => {
        const modal = document.getElementById("infoModal");
        if (event.target === modal) closeModal();
    });
}

function bindYearFilters() {
    document.getElementById("employeeYearSelect").addEventListener("change", event => {
        selectedEmployeeYear = Number(event.target.value);
        if (currentEmployee) renderEmployeeDashboard(currentEmployee, selectedEmployeeYear);
    });

    document.getElementById("companyYearSelect").addEventListener("change", event => {
        selectedCompanyYear = Number(event.target.value);
        if (currentSession?.role === "enterprise") {
            renderCompanyDashboard(currentSession.companyId, selectedCompanyYear);
        }
    });

    document.getElementById("companyGenderSelect").addEventListener("change", event => {
        selectedCompanyGender = event.target.value;
        if (currentSession?.role === "enterprise") {
            renderCompanyDashboard(currentSession.companyId, selectedCompanyYear);
        }
    });

    document.getElementById("companyAgeGroupSelect").addEventListener("change", event => {
        selectedCompanyAgeGroup = event.target.value;
        if (currentSession?.role === "enterprise") {
            renderCompanyDashboard(currentSession.companyId, selectedCompanyYear);
        }
    });
}

function updateAuthHint() {
    const accountId = document.getElementById("accountId");
    const password = document.getElementById("password");
    const title = document.getElementById("authTitle");
    const hint = document.getElementById("authHint");
    document.getElementById("authError").textContent = "";

    if (selectedRole === "enterprise") {
        accountId.value = "CORP001";
        password.value = "admin123";
        title.textContent = "企業帳號登入";
        hint.textContent = "測試企業：CORP001 / admin123。登入後只顯示公司層級匿名統計。";
    } else {
        accountId.value = "E001";
        password.value = "1234";
        title.textContent = "員工帳號登入";
        hint.textContent = "測試員工：E001 / 1234，也可使用 E002 / 1234、E003 / 1234。";
    }
}

function handleAuthLogin() {
    const accountId = document.getElementById("accountId").value.trim().toUpperCase();
    const password = document.getElementById("password").value;
    const account = database.userAccounts.find(user =>
        user.accountId === accountId &&
        user.password === password &&
        user.role === selectedRole
    );

    if (!account) {
        document.getElementById("authError").textContent = "帳號、密碼或登入身份不正確。";
        return;
    }

    currentSession = account;
    configureNavbar(account.role);
    document.getElementById("appNavbar").classList.remove("hidden");

    if (account.role === "enterprise") {
        currentEmployee = null;
        selectedCompanyYear = getAvailableYears().at(-1);
        selectedCompanyGender = "all";
        selectedCompanyAgeGroup = "all";
        populateYearSelect("companyYearSelect", getAvailableYears(), selectedCompanyYear);
        document.getElementById("companyGenderSelect").value = selectedCompanyGender;
        document.getElementById("companyAgeGroupSelect").value = selectedCompanyAgeGroup;
        renderCompanyDashboard(account.companyId, selectedCompanyYear);
        showPage("company-page");
    } else {
        currentEmployee = getEmployee(account.employeeId);
        selectedEmployeeYear = getEmployeeYears(account.employeeId).at(-1);
        populateYearSelect("employeeYearSelect", getEmployeeYears(account.employeeId), selectedEmployeeYear);
        renderEmployeeDashboard(currentEmployee, selectedEmployeeYear);
        showPage("home-page");
    }

    showChatbotForSession(account.role);
}

function logout() {
    currentSession = null;
    currentEmployee = null;
    document.getElementById("appNavbar").classList.add("hidden");
    document.getElementById("authError").textContent = "";
    hideChatbot();
    showPage("auth-page");
}

function configureNavbar(role) {
    document.querySelectorAll(".employee-only").forEach(item => item.classList.toggle("hidden", role !== "employee"));
    document.querySelectorAll(".enterprise-only").forEach(item => item.classList.toggle("hidden", role !== "enterprise"));
}

function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active");
        section.classList.add("hidden");
    });

    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;
    targetPage.classList.remove("hidden");
    targetPage.classList.add("active");
}

function bindChatbot() {
    const toggleButton = document.getElementById("chatbotToggleBtn");
    const closeButton = document.getElementById("chatbotCloseBtn");
    const form = document.getElementById("chatbotForm");

    toggleButton.addEventListener("click", () => {
        const panel = document.getElementById("chatbotPanel");
        setChatbotOpen(panel.classList.contains("hidden"));
    });

    closeButton.addEventListener("click", () => setChatbotOpen(false));

    form.addEventListener("submit", event => {
        event.preventDefault();
        handleChatbotSubmit();
    });
}

function showChatbotForSession(role) {
    const widget = document.getElementById("chatbotWidget");
    const subtitle = document.getElementById("chatbotSubtitle");
    const input = document.getElementById("chatbotInput");
    widget.classList.remove("hidden");
    resetChatbot();

    if (role === "enterprise") {
        subtitle.textContent = "Anonymous corporate wellness insights";
        input.placeholder = "Ask about company wellness trends or programs";
        appendChatbotMessage("你好，我會根據企業端匿名統計，協助整理健康趨勢、課程配置與 ESG 健康管理建議。", "bot");
        return;
    }

    const displayName = getEmployeeDisplayName(currentEmployee);
    subtitle.textContent = `${displayName}'s health coach`;
    input.placeholder = "Ask about exercise, diet, or your health report";
    appendChatbotMessage(`Hi ${displayName}，我可以根據你的歷年健檢趨勢，提供運動、飲食、課程與合作店家的建議。`, "bot");
}

function hideChatbot() {
    document.getElementById("chatbotWidget").classList.add("hidden");
    setChatbotOpen(false);
    resetChatbot();
}

function resetChatbot() {
    const messages = document.getElementById("chatbotMessages");
    const error = document.getElementById("chatbotError");
    const input = document.getElementById("chatbotInput");
    messages.replaceChildren();
    error.textContent = "";
    input.value = "";
    chatbotLoadingMessage = null;
    setChatbotLoading(false);
}

function setChatbotOpen(isOpen) {
    const panel = document.getElementById("chatbotPanel");
    const toggleButton = document.getElementById("chatbotToggleBtn");
    panel.classList.toggle("hidden", !isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
}

function setChatbotLoading(isLoading) {
    document.getElementById("chatbotInput").disabled = isLoading;
    document.getElementById("chatbotSendBtn").disabled = isLoading;
}

function appendChatbotMessage(text, sender, options = {}) {
    const messages = document.getElementById("chatbotMessages");
    const message = document.createElement("div");
    message.className = `chatbot-message chatbot-message-${sender}`;
    if (options.loading) message.classList.add("chatbot-message-loading");
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
}

async function handleChatbotSubmit() {
    if (!currentSession || chatbotLoadingMessage) return;

    const input = document.getElementById("chatbotInput");
    const error = document.getElementById("chatbotError");
    const question = input.value.trim();
    if (!question) return;

    error.textContent = "";
    input.value = "";
    appendChatbotMessage(question, "user");
    chatbotLoadingMessage = appendChatbotMessage("正在整理你的健康資料並產生建議...", "bot", { loading: true });
    setChatbotLoading(true);

    try {
        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: currentSession.role,
                message: question,
                context: buildChatContext(question)
            })
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.error || "AI Coach 暫時無法回覆，請稍後再試。");
        }

        removeChatbotLoadingMessage();
        appendChatbotMessage(payload.reply || "AI Coach 暫時沒有產生內容，請換個方式再問一次。", "bot");
    } catch (errorObject) {
        removeChatbotLoadingMessage();
        error.textContent = errorObject.message || "AI Coach 暫時無法回覆，請稍後再試。";
    } finally {
        setChatbotLoading(false);
    }
}

function removeChatbotLoadingMessage() {
    if (!chatbotLoadingMessage) return;
    chatbotLoadingMessage.remove();
    chatbotLoadingMessage = null;
}

function buildChatContext(question) {
    if (currentSession?.role === "enterprise") {
        return buildEnterpriseChatContext(question);
    }
    return buildEmployeeChatContext(question);
}

function buildEmployeeChatContext(question) {
    const employee = currentEmployee;
    const displayName = getEmployeeDisplayName(employee);
    const history = getHealthHistory(employee.employeeId);
    const selectedYear = selectedEmployeeYear || history.at(-1)?.year;
    const analysis = analyzeEmployee(employee, selectedYear);
    const riskKeys = analysis.checks.filter(check => check.isRisk).map(check => check.key);

    return {
        mode: "employee",
        userQuestion: question,
        privacy: "Use displayName only. Do not use Chinese personal names.",
        displayName,
        profile: {
            age: employee.age,
            gender: employee.gender,
            department: employee.department,
            freeClasses: employee.freeClasses
        },
        selectedYear: analysis.year,
        latestRecord: summarizeHealthRecord(analysis.latestRecord),
        currentRisk: {
            level: analysis.level,
            riskCount: analysis.riskCount,
            riskyMetrics: analysis.checks
                .filter(check => check.isRisk)
                .map(check => ({ key: check.key, label: check.label, value: check.value }))
        },
        history: history.map(record => ({
            year: record.year,
            ...summarizeHealthRecord(record),
            riskCount: analyzeEmployee(employee, record.year).riskCount
        })),
        trends: summarizeEmployeeTrends(history),
        resources: {
            recommendedCourses: getRecommendedCourses(riskKeys),
            benefitsAndStores: getCompactBenefits()
        }
    };
}

function buildEnterpriseChatContext(question) {
    const year = selectedCompanyYear || getAvailableYears().at(-1);
    const filters = getCompanyFilters();
    const company = database.companies.find(item => item.companyId === currentSession.companyId);
    const employees = getCompanyEmployees(currentSession.companyId, filters);
    const analyses = employees.map(employee => analyzeEmployee(employee, year));
    const total = analyses.length;
    const safe = analyses.filter(analysis => analysis.riskCount === 0).length;
    const caution = analyses.filter(analysis => analysis.riskCount > 0 && analysis.riskCount < 3).length;
    const danger = analyses.filter(analysis => analysis.riskCount >= 3).length;

    return {
        mode: "enterprise",
        userQuestion: question,
        privacy: "Anonymous aggregate statistics only. Never mention employee names, employee IDs, or individual records.",
        company: {
            name: company?.name || currentSession.companyId,
            industry: company?.industry || "unknown"
        },
        filters: {
            year,
            gender: filters.gender,
            ageGroup: filters.ageGroup
        },
        summary: {
            employeeCount: total,
            safeCount: safe,
            cautionCount: caution,
            interventionCount: danger,
            highRiskRate: total > 0 ? formatPercent((caution + danger) / total) : "0%",
            interventionRate: total > 0 ? formatPercent(danger / total) : "0%"
        },
        yearStats: summarizeCompanyStats(currentSession.companyId, year, filters),
        riskMetricDistribution: riskRules.map(rule => {
            const count = analyses.filter(analysis =>
                analysis.checks.some(check => check.key === rule.key && check.isRisk)
            ).length;
            return {
                key: rule.key,
                label: rule.label,
                count,
                rate: total > 0 ? formatPercent(count / total) : "0%"
            };
        }),
        yearTrend: getAvailableYears().map(item => ({
            year: item,
            ...summarizeCompanyStats(currentSession.companyId, item, filters)
        })),
        departmentStats: summarizeDepartmentsForEnterprise(analyses),
        courseUsage: summarizeCourseUsage(employees)
    };
}

function summarizeHealthRecord(record) {
    return {
        waist: record.waist,
        bp: `${record.bpS}/${record.bpD}`,
        glucose: record.glucose,
        tg: record.tg,
        hdl: record.hdl,
        bmi: record.bmi
    };
}

function summarizeEmployeeTrends(history) {
    if (history.length < 2) return [];

    const previous = history.at(-2);
    const current = history.at(-1);
    return [
        { key: "waist", label: "腰圍", unit: "cm" },
        { key: "glucose", label: "空腹血糖", unit: "mg/dL" },
        { key: "tg", label: "三酸甘油酯", unit: "mg/dL" },
        { key: "hdl", label: "HDL膽固醇", unit: "mg/dL" },
        { key: "bmi", label: "BMI", unit: "" }
    ].map(metric => ({
        label: metric.label,
        previousYear: previous.year,
        currentYear: current.year,
        previousValue: previous[metric.key],
        currentValue: current[metric.key],
        change: Number((current[metric.key] - previous[metric.key]).toFixed(1)),
        unit: metric.unit
    }));
}

function getRecommendedCourses(riskKeys) {
    const courses = database.exerciseCourses.filter(course => {
        if (riskKeys.length === 0) return true;
        return course.focus.split(",").some(key => riskKeys.includes(key));
    });

    return courses.slice(0, 4).map(course => ({
        name: course.name,
        coach: course.coach,
        focus: course.focus,
        schedule: course.schedule,
        location: course.location,
        duration: course.duration,
        description: course.description
    }));
}

function getCompactBenefits() {
    return database.healthBenefits.map(benefit => ({
        category: benefit.category,
        name: benefit.name,
        description: benefit.description,
        stores: (benefit.stores || []).slice(0, 3).map(store => store.name)
    }));
}

function summarizeCompanyStats(companyId, year, filters) {
    const stats = getCompanyYearStats(companyId, year, filters);
    return {
        highRiskRate: `${Math.round(stats.highRiskRate)}%`,
        metabolicRate: `${Math.round(stats.metabolicRate)}%`,
        averageRisk: Number(stats.averageRisk.toFixed(1)),
        averageWaist: Number(stats.averageWaist.toFixed(1)),
        averageGlucose: Number(stats.averageGlucose.toFixed(1))
    };
}

function summarizeDepartmentsForEnterprise(analyses) {
    const departments = groupBy(analyses, analysis => analysis.employee.department);
    const rows = Object.entries(departments)
        .map(([department, rows]) => {
            const count = rows.length;
            return {
                department,
                employeeCount: count,
                highRiskRate: formatPercent(rows.filter(row => row.riskCount > 0).length / count),
                interventionRate: formatPercent(rows.filter(row => row.riskCount >= 3).length / count),
                averageRisk: Number((rows.reduce((sum, row) => sum + row.riskCount, 0) / count).toFixed(1))
            };
        });
    const publishableRows = rows.filter(row => row.employeeCount >= 5);

    return {
        rows: publishableRows,
        suppressedSmallGroups: rows.length - publishableRows.length
    };
}

function summarizeCourseUsage(employees) {
    const employeeIds = new Set(employees.map(employee => employee.employeeId));
    return database.exerciseCourses.map(course => {
        const count = database.courseBookings.filter(booking =>
            booking.courseId === course.courseId &&
            employeeIds.has(booking.employeeId)
        ).length;

        return {
            name: course.name,
            focus: course.focus,
            schedule: course.schedule,
            capacity: course.capacity,
            currentBookings: count,
            usageRate: formatPercent(count / course.capacity)
        };
    });
}

function getEmployee(employeeId) {
    return database.employeeInfo.find(employee => employee.employeeId === employeeId);
}

function getEmployeeDisplayName(employee) {
    return employee?.englishName || employee?.employeeId || "Employee";
}

function getHealthHistory(employeeId) {
    return database.healthCheckRecords
        .filter(record => record.employeeId === employeeId)
        .sort((a, b) => a.year - b.year);
}

function getEmployeeYears(employeeId) {
    return getHealthHistory(employeeId).map(record => record.year);
}

function getAvailableYears() {
    return [...new Set(database.healthCheckRecords.map(record => record.year))].sort((a, b) => a - b);
}

function getCompanyFilters() {
    return {
        gender: selectedCompanyGender,
        ageGroup: selectedCompanyAgeGroup
    };
}

function getCompanyEmployees(companyId, filters = getCompanyFilters()) {
    return database.employeeInfo.filter(employee => {
        const isSameCompany = employee.companyId === companyId;
        const isGenderMatched = filters.gender === "all" || employee.gender === filters.gender;
        const isAgeMatched = filters.ageGroup === "all" || matchAgeGroup(employee.age, filters.ageGroup);
        return isSameCompany && isGenderMatched && isAgeMatched;
    });
}

function matchAgeGroup(age, ageGroup) {
    if (ageGroup === "under30") return age <= 30;
    if (ageGroup === "31-40") return age >= 31 && age <= 40;
    if (ageGroup === "41-50") return age >= 41 && age <= 50;
    if (ageGroup === "51-60") return age >= 51 && age <= 60;
    if (ageGroup === "61plus") return age >= 61;
    return true;
}

function populateYearSelect(selectId, years, selectedYear) {
    const select = document.getElementById(selectId);
    select.replaceChildren();

    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = `${year} 年`;
        option.selected = year === selectedYear;
        select.append(option);
    });
}

function getHealthRecord(employeeId, year) {
    const history = getHealthHistory(employeeId);
    return history.find(record => record.year === year) || history.at(-1);
}

function analyzeEmployee(employee, year = getEmployeeYears(employee.employeeId).at(-1)) {
    const latestRecord = getHealthRecord(employee.employeeId, year);
    const checks = riskRules.map(rule => ({
        key: rule.key,
        label: rule.label,
        value: rule.getValue(latestRecord),
        isRisk: rule.isRisk(employee, latestRecord)
    }));
    const riskCount = checks.filter(check => check.isRisk).length;

    let level = "safe";
    if (riskCount >= 3) level = "danger";
    else if (riskCount > 0) level = "caution";

    return { employee, latestRecord, checks, riskCount, level, year: latestRecord.year };
}

function renderEmployeeDashboard(employee, year = selectedEmployeeYear) {
    const analysis = analyzeEmployee(employee, year);
    document.getElementById("welcomeMsg").textContent = `歡迎，${getEmployeeDisplayName(employee)}！以下是您的年度健康報告：`;
    document.getElementById("employeeMeta").textContent = `${employee.department}｜${employee.age} 歲｜${employee.gender === "M" ? "男性" : "女性"}`;
    document.getElementById("freeClasses").textContent = employee.freeClasses;
    renderHealthStatus(analysis);
    renderMetrics(analysis);
    renderEmployeeCharts(analysis);
    renderTrendCards(employee.employeeId, analysis.year);
    renderMatchedCourses(analysis);
}

function renderHealthStatus(analysis) {
    const statusDiv = document.getElementById("healthStatus");
    statusDiv.className = `status-alert status-${analysis.level}`;

    if (analysis.level === "danger") {
        statusDiv.textContent = `⚠️ 系統偵測您有 ${analysis.riskCount} 項指標異常，符合「代謝症候群」介入標準。公司已為您啟動 iHealth 介入計畫！`;
    } else if (analysis.level === "caution") {
        statusDiv.textContent = `🔎 系統偵測您有 ${analysis.riskCount} 項指標需留意，屬於代謝症候群高危險群，建議提早使用健康福利資源。`;
    } else {
        statusDiv.textContent = "✅ 您的各項指標良好，未達代謝症候群標準。請繼續保持！";
    }
}

function renderMetrics(analysis) {
    const metricsGrid = document.getElementById("metricsGrid");
    metricsGrid.replaceChildren();

    analysis.checks.forEach(check => {
        const card = document.createElement("div");
        card.className = `metric-card ${check.isRisk ? "warning" : ""}`;

        const label = document.createElement("div");
        label.className = "metric-label";
        label.textContent = check.label;

        const value = document.createElement("h2");
        value.textContent = check.value;

        const state = document.createElement("span");
        state.className = "metric-state";
        state.textContent = check.isRisk ? "異常" : "正常";

        card.append(label, value, state);
        metricsGrid.append(card);
    });

    const bmiCard = document.createElement("div");
    bmiCard.className = `metric-card ${analysis.latestRecord.bmi >= 24 ? "warning-soft" : ""}`;
    const bmiLabel = document.createElement("div");
    bmiLabel.className = "metric-label";
    bmiLabel.textContent = "BMI (輔助參考)";
    const bmiValue = document.createElement("h2");
    bmiValue.textContent = analysis.latestRecord.bmi;
    const bmiState = document.createElement("span");
    bmiState.className = "metric-state";
    bmiState.textContent = analysis.latestRecord.bmi >= 24 ? "需留意" : "參考";
    bmiCard.append(bmiLabel, bmiValue, bmiState);
    metricsGrid.append(bmiCard);
}

function renderEmployeeCharts(analysis) {
    renderDonutChart("employeeRiskDonut", [
        { label: "異常", value: analysis.riskCount, color: analysis.riskCount >= 3 ? "#E63946" : "#F4A261" },
        { label: "正常", value: 5 - analysis.riskCount, color: "#dbeee3" }
    ], `${analysis.riskCount}/5`, "異常項");

    renderMetricDistanceBars(analysis);
    renderEmployeeRiskLine(analysis.employee.employeeId);
}

function renderMetricDistanceBars(analysis) {
    const container = document.getElementById("employeeMetricBars");
    container.replaceChildren();

    const bars = analysis.checks.map(check => {
        const percent = getRiskDistancePercent(analysis.employee, analysis.latestRecord, check.key);
        return {
            label: check.label.replace(" (mg/dL)", "").replace(" (mmHg)", "").replace(" (cm)", ""),
            percent,
            value: `${check.value}`,
            warning: check.isRisk
        };
    });

    bars.forEach(bar => container.append(createBarRow(bar.label, bar.percent, bar.value, bar.warning ? "risk" : "safe")));
}

function renderEmployeeRiskLine(employeeId) {
    const years = getEmployeeYears(employeeId);
    const values = years.map(year => analyzeEmployee(getEmployee(employeeId), year).riskCount);
    renderLineChart("employeeTrendChart", years, [
        { name: "異常項數", values, color: "#2E8B57" }
    ], 5, "項");
}

function renderTrendCards(employeeId, year) {
    const trendGrid = document.getElementById("trendGrid");
    const selectedRecord = getHealthRecord(employeeId, year);
    const previousRecord = getHealthHistory(employeeId)
        .filter(record => record.year < selectedRecord.year)
        .at(-1);
    trendGrid.replaceChildren();

    [
        { key: "waist", label: "腰圍", unit: "cm" },
        { key: "glucose", label: "空腹血糖", unit: "mg/dL" },
        { key: "tg", label: "三酸甘油酯", unit: "mg/dL" }
    ].forEach(metric => {
        const current = selectedRecord[metric.key];
        const previous = previousRecord?.[metric.key];
        const change = previousRecord ? current - previous : 0;
        const card = document.createElement("div");
        card.className = "trend-card";

        const title = document.createElement("strong");
        title.textContent = metric.label;
        const value = document.createElement("span");
        value.textContent = `${current} ${metric.unit}`;
        const delta = document.createElement("span");
        delta.className = change <= 0 ? "trend-good" : "trend-risk";
        const displayChange = Number(Math.abs(change).toFixed(1));
        delta.textContent = previousRecord
            ? `${previousRecord.year}-${selectedRecord.year} ${change <= 0 ? "下降" : "上升"} ${displayChange} ${metric.unit}`
            : `${selectedRecord.year} 尚無前一年資料`;

        card.append(title, value, delta);
        trendGrid.append(card);
    });
}

function renderMatchedCourses(analysis) {
    const bookingArea = document.getElementById("bookingArea");
    const courseGrid = document.getElementById("courseGrid");
    const riskKeys = analysis.checks.filter(check => check.isRisk).map(check => check.key);
    const matchedCourses = database.exerciseCourses.filter(course =>
        course.focus.split(",").some(key => riskKeys.includes(key))
    );

    courseGrid.replaceChildren();
    bookingArea.classList.toggle("hidden", matchedCourses.length === 0);

    matchedCourses.forEach(course => {
        const card = document.createElement("div");
        card.className = "coach-card course-detail-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `查看${course.name}課程資訊`);
        card.addEventListener("click", () => showCourseModal(course));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showCourseModal(course);
            }
        });

        const content = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = `${course.coach}｜${course.name}`;
        const schedule = document.createElement("span");
        schedule.className = "course-time";
        schedule.textContent = `可預約時段：${course.schedule}`;
        content.append(title, document.createElement("br"), schedule);

        const button = document.createElement("button");
        button.className = "btn-primary";
        button.type = "button";
        button.textContent = "立即預約";
        button.addEventListener("click", event => {
            event.stopPropagation();
            bookCourse(course);
        });

        card.append(content, button);
        courseGrid.append(card);
    });
}

function bookCourse(course) {
    if (!currentEmployee) return;

    if (currentEmployee.freeClasses > 0) {
        currentEmployee.freeClasses -= 1;
        database.courseBookings.push({
            bookingId: `BK${String(database.courseBookings.length + 1).padStart(3, "0")}`,
            employeeId: currentEmployee.employeeId,
            courseId: course.courseId,
            status: "confirmed"
        });
        document.getElementById("freeClasses").textContent = currentEmployee.freeClasses;
        alert(`預約成功！已為您預約「${course.name}」，並扣除一次免費額度。`);
    } else {
        alert("本週免費額度已用完。本次預約將自動轉為員工優惠自費價。");
    }
}

function renderBenefits() {
    const benefitsGrid = document.getElementById("benefitsGrid");
    const groupedBenefits = groupBy(database.healthBenefits, benefit => benefit.category);
    benefitsGrid.replaceChildren();

    Object.entries(groupedBenefits).forEach(([category, benefits]) => {
        const group = document.createElement("div");
        group.className = "benefit-category";
        const title = document.createElement("h3");
        title.textContent = category;
        group.append(title);

        benefits.forEach(benefit => {
            const button = document.createElement("button");
            button.className = "partner-card";
            button.type = "button";
            button.textContent = benefit.name;
            button.addEventListener("click", () => {
                if (benefit.type === "courses") {
                    showCourseListModal(benefit);
                    return;
                }
                showModal(benefit.name, benefit.description, benefit.stores);
            });
            group.append(button);
        });

        benefitsGrid.append(group);
    });
}

function renderCompanyDashboard(companyId, year = selectedCompanyYear || getAvailableYears().at(-1)) {
    const filters = getCompanyFilters();
    const employees = getCompanyEmployees(companyId, filters);
    const analyses = employees.map(employee => analyzeEmployee(employee, year));
    const total = employees.length;
    const highRisk = analyses.filter(analysis => analysis.riskCount > 0).length;
    const metabolic = analyses.filter(analysis => analysis.riskCount >= 3).length;
    const averageRisk = total > 0
        ? analyses.reduce((sum, analysis) => sum + analysis.riskCount, 0) / total
        : 0;

    renderSummaryCards([
        { label: "員工總數", value: total, note: `納入 ${year} 年健檢` },
        { label: "高風險比例", value: total > 0 ? formatPercent(highRisk / total) : "0%", note: "至少 1 項異常" },
        { label: "代謝症候群", value: total > 0 ? formatPercent(metabolic / total) : "0%", note: `${metabolic} 位需介入` },
        { label: "平均異常項", value: averageRisk.toFixed(1), note: "五項指標平均" }
    ]);
    renderCompanyRiskDonut(analyses);
    renderCompanyYearTrend(companyId, filters);
    renderCompanyYearComparison(companyId, year, filters);
    renderRiskBars(analyses);
    renderDepartmentRiskChart(analyses);
    renderDepartmentTable(analyses);
    renderCourseUsage(employees);
}

function renderSummaryCards(cards) {
    const grid = document.getElementById("companySummaryGrid");
    grid.replaceChildren();

    cards.forEach(item => {
        const card = document.createElement("div");
        card.className = "summary-card";
        const label = document.createElement("span");
        label.textContent = item.label;
        const value = document.createElement("strong");
        value.textContent = item.value;
        const note = document.createElement("small");
        note.textContent = item.note;
        card.append(label, value, note);
        grid.append(card);
    });
}

function renderRiskBars(analyses) {
    const container = document.getElementById("riskBars");
    container.replaceChildren();

    if (analyses.length === 0) {
        renderEmptyState(container, "此篩選條件沒有風險指標資料。");
        return;
    }

    riskRules.forEach(rule => {
        const count = analyses.filter(analysis =>
            analysis.checks.some(check => check.key === rule.key && check.isRisk)
        ).length;
        const percent = count / analyses.length;

        const row = document.createElement("div");
        row.className = "bar-row";
        const label = document.createElement("span");
        label.textContent = rule.label.replace(" (mg/dL)", "").replace(" (cm)", "");
        const barWrap = document.createElement("div");
        barWrap.className = "bar-wrap";
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = `${Math.max(6, percent * 100)}%`;
        barWrap.append(bar);
        const value = document.createElement("strong");
        value.textContent = `${count} 人`;
        row.append(label, barWrap, value);
        container.append(row);
    });
}

function renderDepartmentTable(analyses) {
    const table = document.getElementById("departmentTable");
    const departments = groupBy(analyses, analysis => analysis.employee.department);
    table.replaceChildren();

    if (analyses.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "此篩選條件沒有部門資料。";
        tr.append(td);
        table.append(tr);
        return;
    }

    Object.entries(departments).forEach(([department, rows]) => {
        const tr = document.createElement("tr");
        const highRisk = rows.filter(row => row.riskCount > 0).length;
        const metabolic = rows.filter(row => row.riskCount >= 3).length;
        const averageRisk = rows.reduce((sum, row) => sum + row.riskCount, 0) / rows.length;

        [department, rows.length, highRisk, metabolic, averageRisk.toFixed(1)].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.append(td);
        });

        table.append(tr);
    });
}

function renderCompanyRiskDonut(analyses) {
    const safe = analyses.filter(analysis => analysis.riskCount === 0).length;
    const caution = analyses.filter(analysis => analysis.riskCount > 0 && analysis.riskCount < 3).length;
    const danger = analyses.filter(analysis => analysis.riskCount >= 3).length;

    renderDonutChart("companyRiskDonut", [
        { label: "健康維持", value: safe, color: "#2E8B57" },
        { label: "高危險群", value: caution, color: "#F4A261" },
        { label: "需介入", value: danger, color: "#E63946" }
    ], `${danger} 人`, "需介入");
}

function renderCompanyYearTrend(companyId, filters = getCompanyFilters()) {
    const employees = getCompanyEmployees(companyId, filters);
    const years = getAvailableYears();

    if (employees.length === 0) {
        renderEmptyState(document.getElementById("companyYearTrend"), "此篩選條件沒有年度趨勢資料。");
        return;
    }

    const highRiskRates = years.map(year => {
        const analyses = employees.map(employee => analyzeEmployee(employee, year));
        return Math.round(analyses.filter(analysis => analysis.riskCount > 0).length / analyses.length * 100);
    });
    const metabolicRates = years.map(year => {
        const analyses = employees.map(employee => analyzeEmployee(employee, year));
        return Math.round(analyses.filter(analysis => analysis.riskCount >= 3).length / analyses.length * 100);
    });

    renderLineChart("companyYearTrend", years, [
        { name: "高風險", values: highRiskRates, color: "#4682B4" },
        { name: "需介入", values: metabolicRates, color: "#E63946" }
    ], 100, "%");
}

function renderDepartmentRiskChart(analyses) {
    const container = document.getElementById("departmentRiskChart");
    const departments = groupBy(analyses, analysis => analysis.employee.department);
    container.replaceChildren();

    if (analyses.length === 0) {
        renderEmptyState(container, "此篩選條件沒有部門圖表資料。");
        return;
    }

    Object.entries(departments).forEach(([department, rows]) => {
        const averageRisk = rows.reduce((sum, row) => sum + row.riskCount, 0) / rows.length;
        container.append(createBarRow(department, averageRisk / 5 * 100, averageRisk.toFixed(1), averageRisk >= 3 ? "risk" : "safe"));
    });
}

function renderCompanyYearComparison(companyId, year, filters = getCompanyFilters()) {
    const container = document.getElementById("companyYoYComparison");
    const previousYear = getAvailableYears().filter(item => item < year).at(-1);
    container.replaceChildren();

    if (getCompanyEmployees(companyId, filters).length === 0) {
        renderEmptyState(container, "此篩選條件沒有可比較資料。");
        return;
    }

    if (!previousYear) {
        const empty = document.createElement("p");
        empty.className = "center-muted";
        empty.textContent = `${year} 年尚無前一年資料可比較。`;
        container.append(empty);
        return;
    }

    const currentStats = getCompanyYearStats(companyId, year, filters);
    const previousStats = getCompanyYearStats(companyId, previousYear, filters);

    [
        { label: "高風險比例", key: "highRiskRate", max: 100, unit: "%" },
        { label: "代謝症候群比例", key: "metabolicRate", max: 100, unit: "%" },
        { label: "平均異常項", key: "averageRisk", max: 5, unit: "項" },
        { label: "平均腰圍", key: "averageWaist", max: 110, unit: "cm" },
        { label: "平均空腹血糖", key: "averageGlucose", max: 140, unit: "mg/dL" }
    ].forEach(metric => {
        container.append(createComparisonMetric({
            label: metric.label,
            previousYear,
            currentYear: year,
            previousValue: previousStats[metric.key],
            currentValue: currentStats[metric.key],
            maxValue: metric.max,
            unit: metric.unit
        }));
    });
}

function getCompanyYearStats(companyId, year, filters = getCompanyFilters()) {
    const employees = getCompanyEmployees(companyId, filters);
    const analyses = employees.map(employee => analyzeEmployee(employee, year));
    const records = analyses.map(analysis => analysis.latestRecord);
    const total = analyses.length;

    if (total === 0) {
        return {
            highRiskRate: 0,
            metabolicRate: 0,
            averageRisk: 0,
            averageWaist: 0,
            averageGlucose: 0
        };
    }

    return {
        highRiskRate: analyses.filter(analysis => analysis.riskCount > 0).length / total * 100,
        metabolicRate: analyses.filter(analysis => analysis.riskCount >= 3).length / total * 100,
        averageRisk: analyses.reduce((sum, analysis) => sum + analysis.riskCount, 0) / total,
        averageWaist: records.reduce((sum, record) => sum + record.waist, 0) / total,
        averageGlucose: records.reduce((sum, record) => sum + record.glucose, 0) / total
    };
}

function renderCourseUsage(employees) {
    const grid = document.getElementById("courseUsageGrid");
    const employeeIds = new Set(employees.map(employee => employee.employeeId));
    grid.replaceChildren();

    database.exerciseCourses.forEach(course => {
        const count = database.courseBookings.filter(booking =>
            booking.courseId === course.courseId &&
            employeeIds.has(booking.employeeId)
        ).length;
        const card = document.createElement("div");
        card.className = "benefit-category course-detail-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `查看${course.name}課程資訊`);
        card.addEventListener("click", () => showCourseModal(course));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showCourseModal(course);
            }
        });
        const title = document.createElement("h3");
        title.textContent = course.name;
        const coach = document.createElement("p");
        coach.textContent = `${course.coach}｜${course.schedule}`;
        const usage = document.createElement("strong");
        usage.className = "usage-text";
        usage.textContent = `${count}/${course.capacity} 人`;
        card.append(title, coach, usage);
        grid.append(card);
    });
}

function renderEmptyState(container, message) {
    container.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "center-muted empty-state";
    empty.textContent = message;
    container.append(empty);
}

function getRiskDistancePercent(employee, record, key) {
    if (key === "waist") {
        const threshold = employee.gender === "M" ? 90 : 80;
        return Math.min(140, record.waist / threshold * 100);
    }
    if (key === "bp") {
        return Math.min(140, Math.max(record.bpS / 130, record.bpD / 85) * 100);
    }
    if (key === "glucose") return Math.min(140, record.glucose);
    if (key === "tg") return Math.min(140, record.tg / 150 * 100);
    if (key === "hdl") {
        const threshold = employee.gender === "M" ? 40 : 50;
        return Math.min(140, threshold / Math.max(record.hdl, 1) * 100);
    }
    return 0;
}

function createBarRow(labelText, percent, valueText, tone) {
    const row = document.createElement("div");
    row.className = `chart-bar-row ${tone}`;

    const label = document.createElement("span");
    label.textContent = labelText;

    const barWrap = document.createElement("div");
    barWrap.className = "bar-wrap";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `${Math.max(4, Math.min(100, percent))}%`;
    barWrap.append(bar);

    const value = document.createElement("strong");
    value.textContent = valueText;

    row.append(label, barWrap, value);
    return row;
}

function createComparisonMetric(metric) {
    const card = document.createElement("div");
    card.className = "compare-metric";
    const change = metric.currentValue - metric.previousValue;
    const improved = change <= 0;

    const header = document.createElement("div");
    header.className = "compare-header";
    const title = document.createElement("strong");
    title.textContent = metric.label;
    const delta = document.createElement("span");
    delta.className = improved ? "trend-good" : "trend-risk";
    delta.textContent = `${improved ? "下降" : "上升"} ${formatMetricValue(Math.abs(change), metric.unit)}`;
    header.append(title, delta);

    const previousBar = createComparisonBar(metric.previousYear, metric.previousValue, metric.maxValue, metric.unit, "previous");
    const currentBar = createComparisonBar(metric.currentYear, metric.currentValue, metric.maxValue, metric.unit, improved ? "current-good" : "current-risk");

    card.append(header, previousBar, currentBar);
    return card;
}

function createComparisonBar(year, value, maxValue, unit, tone) {
    const row = document.createElement("div");
    row.className = `compare-bar ${tone}`;

    const label = document.createElement("span");
    label.textContent = year;

    const barWrap = document.createElement("div");
    barWrap.className = "bar-wrap";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `${Math.max(4, Math.min(100, value / maxValue * 100))}%`;
    barWrap.append(bar);

    const number = document.createElement("strong");
    number.textContent = formatMetricValue(value, unit);

    row.append(label, barWrap, number);
    return row;
}

function formatMetricValue(value, unit) {
    const rounded = unit === "%" ? Math.round(value) : value.toFixed(1);
    return `${rounded}${unit}`;
}

function renderDonutChart(containerId, segments, centerText, subText) {
    const container = document.getElementById(containerId);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    let cursor = 0;
    const gradientParts = segments
        .filter(segment => segment.value > 0)
        .map(segment => {
            const start = cursor;
            const end = cursor + (segment.value / total * 360);
            cursor = end;
            return `${segment.color} ${start}deg ${end}deg`;
        });

    container.replaceChildren();

    const circle = document.createElement("div");
    circle.className = "donut-circle";
    circle.style.background = total > 0
        ? `conic-gradient(${gradientParts.join(", ")})`
        : "conic-gradient(#e9f5ec 0deg 360deg)";

    const center = document.createElement("div");
    center.className = "donut-center";
    const value = document.createElement("strong");
    value.textContent = centerText;
    const label = document.createElement("span");
    label.textContent = subText;
    center.append(value, label);
    circle.append(center);

    const legend = document.createElement("div");
    legend.className = "donut-legend";
    segments.forEach(segment => {
        const item = document.createElement("span");
        const color = document.createElement("i");
        color.style.background = segment.color;
        item.append(color, document.createTextNode(`${segment.label} ${segment.value}`));
        legend.append(item);
    });

    container.append(circle, legend);
}

function renderLineChart(containerId, years, seriesList, maxValue, suffix) {
    const container = document.getElementById(containerId);
    const svg = createSvgElement("svg", { viewBox: "0 0 380 190", role: "img" });
    const width = 380;
    const height = 190;
    const left = 38;
    const right = 18;
    const top = 20;
    const bottom = 34;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    container.replaceChildren();

    [0, 0.5, 1].forEach(step => {
        const y = top + chartHeight - chartHeight * step;
        svg.append(createSvgElement("line", {
            x1: left,
            y1: y,
            x2: width - right,
            y2: y,
            class: "chart-grid-line"
        }));
        svg.append(createSvgElement("text", {
            x: left - 8,
            y: y + 4,
            class: "chart-axis-label",
            "text-anchor": "end"
        }, `${Math.round(maxValue * step)}${suffix}`));
    });

    years.forEach((year, index) => {
        const x = years.length === 1 ? left + chartWidth / 2 : left + index / (years.length - 1) * chartWidth;
        svg.append(createSvgElement("text", {
            x,
            y: height - 8,
            class: "chart-axis-label",
            "text-anchor": "middle"
        }, year));
    });

    seriesList.forEach(series => {
        const points = series.values.map((value, index) => {
            const x = years.length === 1 ? left + chartWidth / 2 : left + index / (years.length - 1) * chartWidth;
            const y = top + chartHeight - Math.min(value, maxValue) / maxValue * chartHeight;
            return { x, y, value };
        });

        svg.append(createSvgElement("polyline", {
            points: points.map(point => `${point.x},${point.y}`).join(" "),
            fill: "none",
            stroke: series.color,
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        }));

        points.forEach(point => {
            svg.append(createSvgElement("circle", {
                cx: point.x,
                cy: point.y,
                r: 4,
                fill: series.color
            }));
        });
    });

    const legend = document.createElement("div");
    legend.className = "chart-legend";
    seriesList.forEach(series => {
        const item = document.createElement("span");
        const color = document.createElement("i");
        color.style.background = series.color;
        item.append(color, document.createTextNode(series.name));
        legend.append(item);
    });

    container.append(svg, legend);
}

function createSvgElement(tagName, attributes, textContent = "") {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (textContent) element.textContent = textContent;
    return element;
}

function showModal(title, description, stores = []) {
    const modalStores = document.getElementById("modalStores");
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = description;
    modalStores.replaceChildren();

    if (stores.length > 0) {
        const heading = document.createElement("h3");
        heading.className = "modal-stores-title";
        heading.textContent = "桃園中壢合作店面";

        const list = document.createElement("ul");
        list.className = "modal-store-list";

        stores.forEach(store => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = store.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = store.name;
            item.append(link);
            list.append(item);
        });

        modalStores.append(heading, list);
    }

    document.getElementById("infoModal").style.display = "block";
}

function showCourseListModal(benefit) {
    const modalStores = document.getElementById("modalStores");
    document.getElementById("modalTitle").textContent = benefit.name;
    document.getElementById("modalDesc").textContent = benefit.description;
    modalStores.replaceChildren();

    const heading = document.createElement("h3");
    heading.className = "modal-stores-title";
    heading.textContent = "目前開設課程";

    const list = document.createElement("ul");
    list.className = "modal-store-list";

    database.exerciseCourses.forEach(course => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.className = "modal-course-button";
        button.type = "button";
        button.textContent = `${course.name}｜${course.coach}`;
        button.addEventListener("click", () => showCourseModal(course));
        item.append(button);
        list.append(item);
    });

    modalStores.append(heading, list);
    document.getElementById("infoModal").style.display = "block";
}

function showCourseModal(course) {
    const modalStores = document.getElementById("modalStores");
    document.getElementById("modalTitle").textContent = course.name;
    document.getElementById("modalDesc").textContent = `${course.coach}｜${course.schedule}`;
    modalStores.replaceChildren();

    const heading = document.createElement("h3");
    heading.className = "modal-stores-title";
    heading.textContent = "課程資訊";

    const list = document.createElement("ul");
    list.className = "modal-store-list";

    [
        ["課程內容", course.description],
        ["時長", course.duration],
        ["地點", course.location],
    ].forEach(([label, value]) => {
        const item = document.createElement("li");
        item.textContent = `${label}：${value}`;
        list.append(item);
    });

    modalStores.append(heading, list);
    document.getElementById("infoModal").style.display = "block";
}

function closeModal() {
    document.getElementById("infoModal").style.display = "none";
}

function groupBy(items, getKey) {
    return items.reduce((groups, item) => {
        const key = getKey(item);
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
}
