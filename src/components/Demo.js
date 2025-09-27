import { useEffect, useState } from "react";
const NFTs = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const response = await fetch("/demo");
      const data = await response.json();
      setNfts(data);
    };

    fetchNFTs();
  }, []);

  return (
    <div>
      <h2>膽大黨盲盒</h2>
      <hr />
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
                  src={`${process.env.REACT_APP_IPFS}/ipfs/${nft.image}`}
                  alt={nft.name}
                  style={{ width: "80px" }}
                />
              </td>
              <td>
                {nft.name}
                <p>{nft.desc}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFTs;
