// ====== 1. 頁面路由控制 ======
function showPage(pageId) {
    // 隱藏所有頁面區塊
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    // 顯示目標頁面
    const targetPage = document.getElementById(pageId);
    targetPage.classList.remove('hidden');
    targetPage.classList.add('active');
}

// ====== 2. 福利詳情 Modal 控制 ======
function showModal(title, description) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = description;
    document.getElementById('infoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// 點擊 Modal 外部也能關閉
window.onclick = function (event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ====== 3. 員工健康查詢系統邏輯 ======
const mockDatabase = [
    {
        empId: "E001", name: "王小明", gender: "M",
        healthData: {
            waist: 95,     // 男 >= 90cm (超標)
            bp_s: 135,     // >= 130mmHg (超標)
            bp_d: 82,      // 正常
            glucose: 105,  // >= 100mg/dL (超標)
            tg: 140,       // 正常
            hdl: 45        // 正常
        }
    }
];

let currentFreeClasses = 2;

function handleLogin() {
    const empId = document.getElementById("empId").value;
    const empName = document.getElementById("empName").value;
    const user = mockDatabase.find(u => u.empId === empId && u.name === empName);

    if (user) {
        document.getElementById("loginArea").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("welcomeMsg").innerText = `歡迎，${user.name}！以下是您的年度健康報告：`;
        analyzeHealth(user);
    } else {
        alert("工號或姓名錯誤，請重新輸入。");
    }
}

function analyzeHealth(user) {
    const data = user.healthData;
    let metricsHTML = "";

    // 定義檢驗標準
    const checks = [
        { label: "腰圍 (cm)", value: data.waist, isRisk: (user.gender === 'M' ? data.waist >= 90 : data.waist >= 80) },
        { label: "收縮壓 (mmHg)", value: data.bp_s, isRisk: data.bp_s >= 130 },
        { label: "舒張壓 (mmHg)", value: data.bp_d, isRisk: data.bp_d >= 85 },
        { label: "空腹血糖 (mg/dL)", value: data.glucose, isRisk: data.glucose >= 100 },
        { label: "三酸甘油酯 (mg/dL)", value: data.tg, isRisk: data.tg >= 150 },
        { label: "HDL膽固醇", value: data.hdl, isRisk: (user.gender === 'M' ? data.hdl < 40 : data.hdl < 50) }
    ];

    checks.forEach(check => {
        let riskClass = check.isRisk ? "warning" : "";
        metricsHTML += `<div class="metric-card ${riskClass}">
                            <div style="font-size:0.9em; color:#666;">${check.label}</div>
                            <h2 style="margin:10px 0 0 0;">${check.value}</h2>
                        </div>`;
    });

    // 嚴謹計算五大指標超標數量 (血壓合併算一項)
    let actualRiskCount = 0;
    if (user.gender === 'M' ? data.waist >= 90 : data.waist >= 80) actualRiskCount++;
    if (data.bp_s >= 130 || data.bp_d >= 85) actualRiskCount++;
    if (data.glucose >= 100) actualRiskCount++;
    if (data.tg >= 150) actualRiskCount++;
    if (user.gender === 'M' ? data.hdl < 40 : data.hdl < 50) actualRiskCount++;

    document.getElementById("metricsGrid").innerHTML = metricsHTML;

    const statusDiv = document.getElementById("healthStatus");
    const bookingArea = document.getElementById("bookingArea");

    if (actualRiskCount >= 3) {
        statusDiv.className = "status-alert status-danger";
        statusDiv.innerHTML = `⚠️ 系統偵測您有 ${actualRiskCount} 項指標異常，符合「代謝症候群」標準。<br>公司已為您啟動 iHealth 介入計畫！`;
        bookingArea.classList.remove("hidden");
    } else {
        statusDiv.className = "status-alert status-safe";
        statusDiv.innerHTML = `✅ 您的各項指標良好，未達代謝症候群標準。請繼續保持！`;
    }
}

function bookClass() {
    if (currentFreeClasses > 0) {
        currentFreeClasses--;
        document.getElementById("freeClasses").innerText = currentFreeClasses;
        alert("預約成功！已扣除一次免費額度。請記得準時前往公司健身房。");
    } else {
        alert("本週免費額度已用完。本次預約將自動轉為「員工優惠自費價」，是否確認？");
    }
}