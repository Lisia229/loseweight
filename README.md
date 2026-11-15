# 木漏日 · 好好生活手帳

日系奶油白 × 抹茶綠 × 櫻花粉的小兔健康手帳。繁體中文、響應式、零前端依賴，可部署在 GitHub Pages，也可安裝到手機主畫面。

## 已實作

- 16:8 斷食計時：開始、結束、跨重新整理接續，以及依結束日期查看紀錄。16 小時後顯示達成；不會強制限制進食，也不會發送背景通知。
- 飲食日記：餐別、餐點份量、熱量加總、刪除、補登過去日期。
- AI 文字餐點估算：附可部署的 Cloudflare Worker，回傳粗估熱量及份量假設，確認後才儲存。不包含照片辨識。
- 體重：每天一筆，可覆寫、刪除、看最近 14 筆趨勢。
- 個人計畫：身高、年齡、生理性別、活動量、起始與目標體重、每週速度；依所選日期之前最新體重重新計算。
- 自訂運動：名稱、每日目標、單位，分次累加、一鍵完成／取消、編輯目標及刪除。
- 本機保存、JSON 匯出／匯入、PWA 離線基本功能。

## 在自己的 GitHub 上架

1. 建立一個 GitHub repository，例如 `komorebi-journal`。
2. 將這個資料夾的**內容**推到 repository 根目錄（包含 `.github/workflows/pages.yml` 隱藏資料夾），使用 `main` 分支。
3. 在 GitHub 的 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。
4. 到 **Actions → Deploy journal to GitHub Pages** 查看結果；必要時按 **Run workflow**。
5. 完成後網址通常是 `https://你的帳號.github.io/komorebi-journal/`，以 Pages 顯示的網址為準。

Actions 只發布前端必要檔案，不會把 `api/`、測試與 README 一起當網站資產上架。所有引用均使用相對路徑，支援 repository 子路徑。此交付尚未推送或部署到任何 GitHub 帳號。

## 本機開啟

需要 Python 3：

```sh
cd komorebi
python3 -m http.server 4173 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:4173`。請用 HTTP 伺服器，不要直接雙擊 HTML（瀏覽器會阻擋本機 ES modules）。若使用 Node，也可用 `npm start`，仍需 Python 3。前端不需 npm install。

## 啟用 AI 熱量估算

GitHub Pages 只能託管靜態內容，金鑰放在獨立後端。基本記錄不需要 AI 或 API 金鑰。

1. 在 Cloudflare Workers 建立 Worker，使用 `api/worker.js`；也可在 `api` 資料夾使用官方 Wrangler 部署。
2. 設定環境變數：
   - `ALLOWED_ORIGIN`：你的網站來源，例如 `https://你的帳號.github.io`（**不含 repository 路徑、結尾斜線**）。
   - `OPENAI_MODEL`：你帳號可用、支援 Responses API 和 Structured Outputs 的模型 ID。
3. 設定 Secret：
   - `OPENAI_API_KEY`：你的 OpenAI API 金鑰。
   - `APP_TOKEN`：隨機產生的長密碼（建議至少 32 字元），保護個人估算服務。
4. 部署後，把 Worker 的 HTTPS 網址與 `APP_TOKEN` 填到手帳「手帳設定」。**前端不要填 OpenAI API 金鑰。**
5. 新增餐點、描述份量，按「用 AI 估算熱量」，檢查與修改數字後儲存。

`APP_TOKEN` 只保留在該分頁的 sessionStorage，不會匯出到備份；關閉分頁後可能需重填。AI 會把餐點描述傳給設定的 Worker 與 OpenAI，並可能產生 API 費用。未串接／離線／逾時時仍可手動輸入。此版本以個人使用為範圍；不要把存取密碼分享成公開服務。可在服務供應商側設定用量警示及流量限制。

官方 API 參考：https://developers.openai.com/api/reference/resources/responses/methods/create

## 資料與隱私

- 日記保存在 `localStorage`，依瀏覽器及網站 origin 分開；localhost、GitHub Pages 與不同瀏覽器不共用資料。
- 不包含登入、雲端同步；清除網站資料或更換裝置前，先匯出 JSON。
- 備份可能含體重與飲食，請存到私人位置，不要提交進公開 GitHub repository。
- 匯入會先驗證格式，經畫面確認後取代目前資料。
- 多分頁同時編輯沒有合併機制，請用單一分頁記錄。
- 修改運動目標會套用至歷史日期的完成判定；歷史次數仍保留。刪除目標會移除該目標歷史打卡。

## 熱量規劃的邊界

Mifflin–St Jeor：`10 × kg + 6.25 × cm − 5 × 年齡 + 性別常數`（男性 +5，女性 −161），乘活動係數估算每日維持熱量。

赤字取期望速度、維持熱量 20%、與保守攝取門檻之間的較小值。1,200／1,500 kcal 是這個工具的保護門檻，不是所有人的安全或適當攝取量。若無法產生合適估值，工具會停止自動建議。目標達成後轉為維持；不提供低於 BMI 18.5 的減重規劃。粗估達標天數使用 7,700 kcal/kg，不是生理動態模型，也不保證達標日期。

僅適用一般成人；未滿 18 歲、懷孕／哺乳或特殊疾病用藥狀況不適用自動規劃。16:8 為記錄工具，並非醫療建議。可參考：

- https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner
- https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html

## 測試

Node.js 22+：

```sh
npm test
```

涵蓋熱量公式、防護門檻、維持階段、當地日期、備份驗證、API 授權與來源限制、模擬 AI 成功及失敗。AI 真實連線需先提供服務金鑰，未在交付時呼叫付費 API。

## 檔案

- `index.html` / `style.css` / `app.js`：介面與互動
- `core.js`：日期、計畫、備份驗證
- `manifest.webmanifest` / `sw.js` / `icon-*`：PWA
- `api/`：選用 AI 後端
- `.github/workflows/pages.yml`：GitHub Pages 自動部署
- `tests/`：Node 內建測試，無外部相依
