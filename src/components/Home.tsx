import { Link } from "react-router-dom";
import Mark from "../images/mark.jpg";

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h2>歡迎光臨!</h2>
      <hr />
      <Link to="/demo">
        <img src={Mark} alt="去抽獎" />
        <p />
        <button className="btn btn-primary m-3">查看商品</button>
      </Link>
    </div>
  );
};

export default Home;
