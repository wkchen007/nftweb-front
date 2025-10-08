# nftweb-front

React 開發的 NFT Web API 前端專案，串接後端服務。

## 環境說明

- React 18
- Bootstrap 5
- IPFS
- Solidity NFT ERC-721 智能合約
- Sepolia 測試鏈

## API 功能

### 商品查詢

- `/demo`：取得所有 NFT 商品款式與說明

### NFT 抽獎功能

- `/nft/mint`：抽獎並鑄造 NFT
- `/nft/tokensOfOwner`：查詢持有的 NFT

### 錢包功能

- `/wallet/balance`：查詢錢包餘額
- `/wallet/transfer`：錢包轉帳

## 快速開始

### 1. 建立 .env 檔案

請參考 `.env.example` 檔案，複製為 `.env` 並根據需求修改 IPFS Gateway。

```bash
cp .env.example .env
```

### 2. 安裝依賴

專案根目錄執行以下指令安裝所有套件：

```bash
npm install
```

### 3. 啟動開發伺服器

安裝完成後，執行下列指令伺服器：

```bash
npm start
```

啟動後可於瀏覽器開啟 http://localhost:3000 查看前端畫面。

## 相關專案

- NFT 後端專案 [nftweb-back](https://github.com/wkchen007/nftweb-back)
- 網站微服務專案 [web-microservice](https://github.com/wkchen007/web-microservice)

## 授權

MIT License
