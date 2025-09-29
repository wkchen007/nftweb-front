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
