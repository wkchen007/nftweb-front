import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";
function App() {
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const navigate = useNavigate();

  const logOut = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + jwtToken);

    const requestOptions = {
      method: "POST",
      headers: headers,
      credentials: "include",
    };

    fetch(`/logout`, requestOptions)
      .catch((error) => {
        console.log("error logging out", error);
      })
      .finally(() => {
        setJwtToken("");
      });

    navigate("/login");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">快樂屋</h1>
        </div>
        <div className="col text-end">
          {jwtToken === "" ? (
            <Link to="/login">
              <span className="badge bg-success">Login</span>
            </Link>
          ) : (
            <a href="#!" onClick={logOut}>
              <span className="badge bg-danger">Logout</span>
            </a>
          )}
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-3">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>
              <Link
                to="/demo"
                className="list-group-item list-group-item-action"
              >
                商品系列
              </Link>
              {jwtToken !== "" && (
                <>
                  <Link
                    to="/nft"
                    className="list-group-item list-group-item-action"
                  >
                    抽獎
                  </Link>
                  <Link
                    to="/wallet"
                    className="list-group-item list-group-item-action"
                  >
                    錢包
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="col-md-9">
          <Alert message={alertMessage} className={alertClassName} />
          <Outlet
            context={{
              jwtToken,
              setJwtToken,
              setAlertClassName,
              setAlertMessage,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
