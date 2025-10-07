// 取得使用者的 NFT
export async function getTokensOfOwner(includeTokenURI = true) {
  const response = await fetch(`/nft/tokensOfOwner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ IncludeTokenURI: includeTokenURI }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tokensOfOwner");
  }

  const data = await response.json();
  return data.tokens || [];
}

// 建立 fetch 的 request options
export function createRequestOptions({ method = "GET", jwtToken, body } = {}) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (jwtToken) {
    headers.append("Authorization", "Bearer " + jwtToken);
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

// 取得使用者的錢包地址
export async function getWalletAddress(jwtToken) {
  const requestOptions = createRequestOptions({ jwtToken });
  const r = await fetch(`/wallet/address`, requestOptions);
  if (!r.ok) throw new Error("address failed");
  return r.json();
}

// 取得使用者的錢包餘額
export async function getWalletBalance(jwtToken) {
  const requestOptions = createRequestOptions({ jwtToken });
  const r = await fetch(`/wallet/balance`, requestOptions);
  if (!r.ok) throw new Error("balance failed");
  return r.json();
}

// 轉帳
export async function postWalletSend({ to, amountEth, jwtToken }) {
  const r = await fetch(
    `/wallet/transfer`,
    createRequestOptions({
      method: "POST",
      jwtToken,
      body: { to, amountEth },
    })
  );
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(txt || "send failed");
  }
  return r.json();
}
