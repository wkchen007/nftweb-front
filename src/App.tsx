import { useState, useMemo, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";

// 讓子頁面用 useOutletContext<AppOutletContext>() 取得型別
export type AppOutletContext = {
  jwtToken: string;
  setJwtToken: React.Dispatch<React.SetStateAction<string>>;
  setAlertClassName: React.Dispatch<React.SetStateAction<string>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
};

function App() {
  const [alertClassName, setAlertClassName] = useState<string>("d-none");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [jwtToken, setJwtToken] = useState<string>("");

  const navigate = useNavigate();

  const requestOptions = useMemo<RequestInit>(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    // 沒 token 時不加 Authorization
    if (jwtToken) headers.append("Authorization", "Bearer " + jwtToken);
    return {
      method: "POST",
      headers,
      credentials: "include",
    };
  }, [jwtToken]);

  const logOut = useCallback(() => {
    fetch(`/logout`, requestOptions)
      .catch((error) => {
        console.log("error logging out", error);
      })
      .finally(() => {
        setJwtToken("");
        navigate("/login");
      });
  }, [navigate, requestOptions]);

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
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                logOut();
              }}
            >
              <span className="badge bg-danger">Logout</span>
            </a>
          )}
        </div>
        <hr className="mb-3" />
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
            context={
              {
                jwtToken,
                setJwtToken,
                setAlertClassName,
                setAlertMessage,
              } satisfies AppOutletContext
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
