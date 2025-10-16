import { useEffect, useState } from "react";
import { getTokensOfOwner } from "./api";

type DAToken = {
  tokenId: string | number;
  imageURI?: string;
};

const NFT: React.FC = () => {
  const [DATokens, setDATokens] = useState<DAToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const ipfsBase = import.meta.env.VITE_IPFS ?? "";

  useEffect(() => {
    const fetchDATokens = async () => {
      try {
        const _DATokens = await getTokensOfOwner(true);
        setDATokens(_DATokens);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDATokens();
  }, []);

  const handleSend: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    setTxLoading(true);

    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("請輸入有效的抽獎次數");
      setTxLoading(false);
      return;
    }

    try {
      const resp = await fetch("/nft/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await resp.json();

      if (!resp.ok || data?.error) {
        setError(data?.message || "交易失敗");
        return;
      }

      // 交易送出後輪詢查看是否有新 NFT
      let tries = 0;
      const maxTries = 10;
      const prevLen = DATokens.length;

      const pollDATokens = async () => {
        try {
          const _DATokens = await getTokensOfOwner(true);

          // 有新 token 或達最大嘗試次數 -> 結束輪詢
          if (_DATokens.length > prevLen || tries >= maxTries) {
            setDATokens(_DATokens);
            return;
          }

          tries++;
          setTimeout(pollDATokens, 2000);
        } catch (err) {
          console.error("Polling error:", err);
        }
      };

      pollDATokens();
    } catch (err) {
      console.error("Error:", err);
      setError("發送交易時發生錯誤");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">NFT抽獎</h2>
      <hr />

      <form onSubmit={handleSend}>
        <div>
          <p>
            <label>抽獎次數</label>
            <input
              type="number"
              step={1}
              min={0}
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
                  src={`${ipfsBase}/ipfs/${token.imageURI}`}
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
