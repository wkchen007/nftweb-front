import { useEffect, useState } from "react";

type NFT = {
  id: string | number;
  name: string;
  desc: string;
  image: string; //IPFS hash
};

const Demo: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch("/demo");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as NFT[];
        setNfts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    fetchNFTs();
  }, []);

  const ipfsBase = process.env.REACT_APP_IPFS ?? ""; // 例如 https://...mypinata.cloud

  return (
    <div>
      <h2>膽大黨盲盒</h2>
      <hr />

      {error && <div className="alert alert-danger">載入失敗：{error}</div>}

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>款式</th>
            <th>說明</th>
          </tr>
        </thead>
        <tbody>
          {nfts.map((nft) => (
            <tr key={nft.id}>
              <td>
                <img
                  src={`${ipfsBase}/ipfs/${nft.image}`}
                  alt={nft.name}
                  style={{ width: "80px" }}
                />
              </td>
              <td>
                {nft.name}
                <p className="mb-0">{nft.desc}</p>
              </td>
            </tr>
          ))}
          {nfts.length === 0 && !error && (
            <tr>
              <td colSpan={2}>沒有資料</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Demo;
