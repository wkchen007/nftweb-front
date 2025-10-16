import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getWalletAddress, getWalletBalance, postWalletSend } from "./api";
import type { AppOutletContext } from "../App";

type WalletBalanceResponse = { balanceEth: string };
type WalletAddressResponse = { address: string };
type WalletSendResponse = { txHash: string; explorerUrl: string };

const Wallet: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txLink, setTxLink] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const { jwtToken } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  // 初始化 provider & signer（只跑一次）
  useEffect(() => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const { address } = (await getWalletAddress(jwtToken)) as WalletAddressResponse;
        setAddress(address);

        const { balanceEth } = (await getWalletBalance(jwtToken)) as WalletBalanceResponse;
        setBalanceEth(balanceEth);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [jwtToken, navigate]);

  const handleSend: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    setTxLink(null);
    if (!address) return;

    if (!to || !to.startsWith("0x") || to.length < 40) {
      setError("請輸入正確的以太坊地址。");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("請輸入大於 0 的金額(ETH)。");
      return;
    }

    try {
      setLoading(true);
      const { txHash, explorerUrl } = (await postWalletSend({
        to,
        amountEth: amount,
        jwtToken,
      })) as WalletSendResponse;

      setTxHash(txHash);
      setTxLink(explorerUrl);

      // 重新取餘額（輪詢最多 10 次）
      const { address } = (await getWalletAddress(jwtToken)) as WalletAddressResponse;
      setAddress(address);

      let tries = 0;
      const maxTries = 10;
      const pollBalance = async () => {
        const { balanceEth: newBalance } = (await getWalletBalance(jwtToken)) as WalletBalanceResponse;
        if (newBalance !== balanceEth || tries >= maxTries) {
          setBalanceEth(newBalance);
        } else {
          tries++;
          setTimeout(pollBalance, 2000);
        }
      };
      pollBalance();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">我的錢包</h2>
      <hr />
      {address ? (
        <>
          <p>地址：{address}</p>
          <p>餘額：{balanceEth ?? "--"} ETH</p>
        </>
      ) : (
        <p>初始化中…</p>
      )}

      <h2 className="mt-4 mb-3">轉帳</h2>
      <hr />

      {address ? (
        <>
          <form onSubmit={handleSend}>
            <div>
              <p>
                <label>收款地址 (to)</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value.trim())}
                  placeholder="0x 開頭的以太坊地址"
                  className="form-control"
                  style={{ width: "80%" }}
                />
              </p>
            </div>
            <div>
              <p>
                <label>金額 (ETH)</label>
                <input
                  type="number"
                  step="0.0001"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="例如:0.01"
                />
              </p>
            </div>

            {error && <p className="text-danger">{error}</p>}
            <button type="submit" disabled={loading || !address}>
              {loading ? "交易送出中..." : "發送交易"}
            </button>
          </form>

          {txLink && (
            <p className="fs-4">
              交易連結:{" "}
              <a href={txLink} target="_blank" rel="noreferrer">
                {txHash}
              </a>
            </p>
          )}
        </>
      ) : (
        <p>初始化中…</p>
      )}
    </div>
  );
};

export default Wallet;
