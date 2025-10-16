export interface Token {
  tokenId: string;
  imageURI?: string;
}

export interface WalletAddressResponse {
  address: string;
}

export interface WalletBalanceResponse {
  balanceEth: string;
}

export interface WalletSendParams {
  to: string;
  amountEth: string;
  jwtToken: string;
}

export interface RequestOptionsParams {
  method?: string;
  jwtToken?: string;
  body?: any;
}

// ------------------------------------
// 🔹 取得使用者的 NFT
// ------------------------------------
export async function getTokensOfOwner(
  includeTokenURI: boolean = true
): Promise<Token[]> {
  const response = await fetch(`/nft/tokensOfOwner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ IncludeTokenURI: includeTokenURI }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tokensOfOwner");
  }

  const data = await response.json();
  return (data.tokens as Token[]) || [];
}

// ------------------------------------
// 🔹 建立 fetch 的 request options
// ------------------------------------
export function createRequestOptions({
  method = "POST",
  jwtToken,
  body,
}: RequestOptionsParams = {}): RequestInit {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (jwtToken) {
    headers.append("Authorization", "Bearer " + jwtToken);
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

// ------------------------------------
// 🔹 取得使用者的錢包地址
// ------------------------------------
export async function getWalletAddress(
  jwtToken: string
): Promise<WalletAddressResponse> {
  const requestOptions = createRequestOptions({ jwtToken });
  const r = await fetch(`/wallet/address`, requestOptions);
  if (!r.ok) throw new Error("address failed");
  return (await r.json()) as WalletAddressResponse;
}

// ------------------------------------
// 🔹 取得使用者的錢包餘額
// ------------------------------------
export async function getWalletBalance(
  jwtToken: string
): Promise<WalletBalanceResponse> {
  const requestOptions = createRequestOptions({ jwtToken });
  const r = await fetch(`/wallet/balance`, requestOptions);
  if (!r.ok) throw new Error("balance failed");

  const data = (await r.json()) as WalletBalanceResponse;
  return data;
}

// ------------------------------------
// 🔹 轉帳
// ------------------------------------
export async function postWalletSend({
  to,
  amountEth,
  jwtToken,
}: WalletSendParams): Promise<any> {
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
