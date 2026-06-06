# iHealth 企業永續健康平台

iHealth 是一個以企業健康管理與 ESG 健康福祉為主題的網頁專案。平台提供員工個人健檢查詢、健康福利資訊、企業匿名健康統計，以及可依健檢資料提供建議的 AI ChatBot。

## 主要功能

1. 員工登入
   員工可查看個人歷年健檢資料、年度風險狀態、異常指標比例、健康趨勢圖表，以及符合自身風險指標的課程建議。

2. 企業登入
   企業端只顯示公司層級匿名統計，包含高風險比例、代謝症候群比例、平均異常項、年度趨勢、部門風險統計與課程資源使用率。

3. 健康福利與合作資源
   平台整理健康餐盒、營養諮詢、健身房、有氧課程、EAP 壓力支持與血壓自主管理站等公司福利，並提供合作店家資訊。

4. AI ChatBot
   右下角提供 iHealth AI Coach。員工登入時，ChatBot 會根據該員工的英文名稱、歷年健檢資料、異常指標、免費課程額度與公司福利資源，提供運動、飲食與課程建議。企業登入時，ChatBot 只使用匿名統計資料，提供企業健康促進與 ESG 健康管理建議。

## 測試帳號

員工帳號：

```text
E001 / 1234
E002 / 1234
E003 / 1234
```

企業帳號：

```text
CORP001 / admin123
```

## 專案結構

```text
index.html                    網頁主結構
style.css                     網頁樣式
main.js                       前端互動、資料載入、圖表與 ChatBot context 組裝
config.js                     GitHub Pages 用的公開設定，放 AI 後端網址
server.js                     本機或 Render 可用的 Node 後端 proxy
api/chat.js                   Vercel Serverless Function 版本的 AI proxy
data/processed/               轉換後的示範健檢資料
scripts/                      資料轉換腳本
GITHUB_PAGES_AI_DEPLOY.md     GitHub Pages + AI 後端部署說明
```

## 本機執行

建立 `.env`：

```env
GEMINI_API_KEY=your_real_gemini_api_key
PORT=3000
ALLOWED_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
```

啟動伺服器：

```bash
npm start
```

開啟：

```text
http://127.0.0.1:3000
```

## AI ChatBot 架構

前端不會直接呼叫 Gemini API，也不會保存 API key。前端只會把目前登入者可看的資料整理成 RAG context，再送到後端 `/api/chat`。

員工端只會傳送該員工自己的資料，包含英文名稱、年齡、性別、部門、歷年健檢紀錄、風險指標與可用課程福利。

企業端只會傳送匿名統計，不會傳送員工姓名、employeeId 或單一員工健檢明細。

後端會讀取 `GEMINI_API_KEY`，呼叫 Gemini API，並依序使用模型 fallback：

```text
gemini-3.5-flash
gemini-3.1-flash-lite
gemini-2.5-flash
gemini-2.5-flash-lite
```

## GitHub Pages 部署注意事項

GitHub Pages 只能部署靜態網頁，不能執行 `server.js`，也不能讀取 `.env`。因此 AI 功能需要額外部署後端，例如 Vercel、Render、Railway、Cloud Run 或 Firebase Functions。

部署方式：

1. GitHub Pages 放前端檔案。
2. Vercel 或 Render 放 AI 後端。
3. Gemini API key 放在後端平台的環境變數。
4. `config.js` 只放後端 API URL，不放 API key。

範例：

```js
window.IHEALTH_CONFIG = {
    chatApiUrl: "https://your-backend-domain.example/api/chat"
};
```

更完整的部署說明請參考 `GITHUB_PAGES_AI_DEPLOY.md`。

## 安全注意事項

`.env` 已加入 `.gitignore`，不要把真實 API key 放進任何會推上 GitHub 的檔案，例如 `config.js`、`main.js`、`index.html` 或 `.env.example`。

`.env.example` 只保留範例變數名稱，方便其他人知道需要設定哪些環境變數。

## 資料來源

示範資料由 Kaggle `antimoni/metabolic-syndrome` 資料集轉換而來。原始資料為橫斷式資料，本專案為了展示歷年健檢趨勢，將相同性別與年齡資料組合成合成的年度紀錄，僅供課程展示與系統測試使用。
