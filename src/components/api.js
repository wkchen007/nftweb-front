// 取得使用者的 NFT
export async function getTokensOfOwner(owner, includeTokenURI = true) {
  const response = await fetch(`/nft/tokensOfOwner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, IncludeTokenURI: includeTokenURI }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tokensOfOwner");
  }

  const data = await response.json();
  return data.tokens || [];
}

// 取得使用者的錢包地址
export async function getWalletAddress() {
  const r = await fetch(`/wallet/address`);
  if (!r.ok) throw new Error("address failed");
  return r.json();
}

// 取得使用者的錢包餘額
export async function getWalletBalance() {
  const r = await fetch(`/wallet/balance`);
  if (!r.ok) throw new Error("balance failed");
  return r.json();
}

// 轉帳
export async function postWalletSend({ to, amountEth }) {
  const r = await fetch(`/wallet/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, amountEth }),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(txt || "send failed");
  }
  return r.json();
}
