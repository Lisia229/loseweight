# Lisia減肥日記

日系可愛的個人生活手帳。網站：https://lisia229.github.io/loseweight/

## 功能

- 16:8 斷食：可自訂開始日期與時間，補登過去時間；重新開啟仍接續計時。
- 飲食日記：20 種常見食物搜尋、份數調整、自動合計、帶入餐點；也可手動輸入熱量。
- 體重紀錄、趨勢圖及每日熱量參考計畫。
- 自訂運動目標、分次累計與每日打卡。
- JSON 備份與還原，手機加入主畫面、基本功能離線使用。

已移除 AI 估算及金鑰設定，不呼叫任何付費 AI API。
常見食物熱量是依標示份量提供的概估，不是品牌實測值；實際以包裝營養標示、食材重量及烹調方式為準。
份量概念參考：https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=543&pid=8382&sid=9606

## 使用與部署

GitHub Pages 設定：Deploy from a branch → main → / (root)。更新主分支後會自動發布。
前端無外部套件需求。本機啟動：`python3 -m http.server 4173`，再開啟 http://localhost:4173。
請勿直接雙擊 HTML（ES modules 需 HTTP）。

## 資料

紀錄保存在這個網站來源的瀏覽器 localStorage，未上傳 GitHub、不跨裝置同步。
改名保留舊儲存鍵以沿用紀錄與備份。請定期匯出 JSON，勿將私人紀錄放進公開儲存庫。
修改運動目標會影響歷史完成判定；刪除運動目標會移除它的歷史打卡。

## 熱量參考計畫

使用 Mifflin–St Jeor 與活動係數粗估，並限制熱量赤字；結果為參考而非醫療建議。
未滿 18 歲、孕哺期、特殊疾病用藥或過低目標體重不適用自動規劃。
參考：https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner

## 驗證

`node --test tests/core.test.js` 驗證熱量規劃、當地日期與舊版備份相容性。
