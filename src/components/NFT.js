import { useEffect, useState } from "react";

const NFT = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("/nft/tokensOfOwner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: process.env.REACT_APP_Address,
            IncludeTokenURI: true,
          }),
        });
        const data = await response.json();
        setTokens(data.tokens || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setTxLoading(true);
    if (isNaN(amount) || Number(amount) <= 0) {
      setError("請輸入有效的抽獎次數");
      setTxLoading(false);
      return;
    }

    try {
      const response = await fetch("/nft/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.message || "交易失敗");
      }
      console.log("data:", data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">NFT抽獎</h2>
      <hr />
      {
        <form onSubmit={handleSend}>
          <div>
            <p>
              <label>抽獎次數</label>
              <input
                type="number"
                step="1"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01 ETH / 次"
              />
            </p>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" disabled={txLoading}>
            {txLoading ? "交易送出中..." : "發送交易"}
          </button>
        </form>
      }
      <h2 className="mt-4 mb-3">我的NFT</h2>
      <hr />
      {loading ? (
        <p>初始化中...</p>
      ) : tokens.length === 0 ? (
        <p>沒有找到任何 NFT</p>
      ) : (
        <div className="row">
          {tokens.map((token) => (
            <div key={token.tokenId} className="col-2 mb-4">
              <div className="card h-100">
                <img
                  src={`${process.env.REACT_APP_IPFS}/ipfs/${token.imageURI}`}
                  alt={`NFT ${token.tokenId}`}
                  className="card-img-top"
                  style={{ height: "100px", objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFT;
