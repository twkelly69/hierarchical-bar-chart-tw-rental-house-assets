# 台灣租屋資產分層長條圖

這是一個以 D3.js 建立的互動式階層長條圖，示範如何將純前端專案部署到 GitHub Pages。資料為虛構的租屋資產概況，可點擊長條深入下一層分類，或返回上一層瀏覽。

## 本地預覽

1. 先確保已安裝任一靜態伺服器工具，例如 `serve`：
   ```bash
   npm install -g serve
   ```
2. 在專案根目錄啟動伺服器並指定 `site` 資料夾：
   ```bash
   serve site -l 4173
   ```
3. 於瀏覽器開啟 http://localhost:4173 查看視覺化成品。

（若未安裝 Node.js，也可使用 `python -m http.server` 於 `site` 目錄啟動簡易伺服器。）

## GitHub Pages 部署

此專案已內建 GitHub Actions 流程 `.github/workflows/deploy.yml`，會將 `site` 目錄部署到 GitHub Pages。

1. 在 GitHub 專案的 **Settings → Pages** 中，將 **Source** 設為「GitHub Actions」。
2. 推送變更到 `main`（或目前使用的 `work`）分支後，Actions 會自動上傳並發布靜態檔案。
3. Actions 成功後，`github-pages` 環境的 URL 即為公開頁面網址。

## 資料夾結構

```
site/
  index.html  # 視覺化頁面與 D3.js 匯入
  styles.css  # 佈景、排版與互動提示樣式
  main.js     # 階層長條圖資料、互動與導覽邏輯
```

歡迎依照需求替換資料集或調整樣式，提交後即會透過 GitHub Pages 自動更新網站。
