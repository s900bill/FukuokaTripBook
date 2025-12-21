README（最短可用說明）
==================

1) 直接開啟方式（建議）
----------------------
因為瀏覽器安全限制，直接「雙擊 index.html」時 fetch("./trip.json") 可能會被擋。
建議用簡單 local server：

A. Python（電腦已裝 Python）
  在此資料夾開終端機：
  python -m http.server 8000
  然後用瀏覽器開： http://localhost:8000

B. VSCode Live Server
  用 VSCode 開資料夾 → 右鍵 index.html → Open with Live Server

2) 免 server 備援（手機/電腦都可）
--------------------------------
如果你只能離線或不能開 server：
- 用瀏覽器打開 index.html 後，點右上角「載入 JSON」
- 選擇你的 trip.json / trip.sample.json 檔案即可

3) 怎麼換 JSON（資料與網站分離）
------------------------------
- 預設讀同資料夾的 trip.json
- 你可以用 trip.sample.json 當模板，改內容後存成 trip.json
- 欄位缺少不會報錯（頁面會自動略過缺卡片）

4) 管理模式（可選，預設不干擾旅客）
--------------------------------
網址加上 ?admin=1，例如：
  http://localhost:8000/?admin=1
會出現：
- 匯入 JSON（FileReader）
- 匯出 JSON（下載目前資料）
- 匯出「閱讀版 HTML」（自包含、離線可開）
- 產生「給 AI 的規劃 Prompt」（一鍵複製/下載 .txt）

5) 手機怎麼看
------------
- 直接用手機瀏覽器打開（建議同 Wi‑Fi 用電腦開 server）
- 或把「閱讀版 HTML」匯出後傳到群組/雲端，手機離線也能開

6) 匯入/匯出怎麼用
------------------
- 匯入：管理模式 → 選 JSON 檔
- 匯出 JSON：會把你目前載入的資料下載成 trip.json
- 匯出閱讀版 HTML：會產生單一 HTML，包含資料與 UI，可離線直接開
