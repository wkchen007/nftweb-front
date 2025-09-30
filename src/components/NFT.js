import { useEffect, useState } from "react";
import { getTokensOfOwner } from "./api";

const NFT = () => {
  const [DATokens, setDATokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDATokens = async () => {
      try {
        const _DATokens = await getTokensOfOwner(
          process.env.REACT_APP_Address,
          true
        );
        setDATokens(_DATokens);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDATokens();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.message || "交易失敗");
        return;
      }

      let tries = 0;
      const maxTries = 10;
      const prevLen = DATokens.length;

      const pollDATokens = async () => {
        try {
          const _DATokens = await getTokensOfOwner(true);

          // 如果有新 token 或已經達到最大嘗試次數就停止
          if (_DATokens.length > prevLen || tries >= maxTries) {
            setDATokens(_DATokens);
            return;
          }

          tries++;
          setTimeout(pollDATokens, 2000); // 每 2 秒查一次
        } catch (err) {
          console.error("Polling error:", err);
        }
      };

      pollDATokens();
    } catch (error) {
      console.error("Error:", error);
      setError("發送交易時發生錯誤");
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
      ) : DATokens.length === 0 ? (
        <p>沒有找到任何 NFT</p>
      ) : (
        <div className="row">
          {DATokens.map((token) => (
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
