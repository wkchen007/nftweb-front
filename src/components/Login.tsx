import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Input from "./form/Input";
import type { AppOutletContext } from "../App";

type AuthResponse =
  | { error: true; message: string }
  | { error?: false; access_token: string; message?: string };

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 一次拿齊 Outlet context（來自 App.tsx）
  const { setJwtToken, setAlertClassName, setAlertMessage } =
    useOutletContext<AppOutletContext>();

  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const payload = { email, password };

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    fetch(`/authenticate`, requestOptions)
      .then(async (response) => {
        // 伺服器可能回 4xx/5xx 也帶 JSON，先解析
        const data = (await response.json()) as AuthResponse;

        if (!response.ok || (data as any).error) {
          const msg =
            "message" in data && data.message
              ? data.message
              : `Login failed (${response.status})`;
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        // 成功：寫入 token 並清除提示
        setJwtToken((data as { access_token: string }).access_token);
        setAlertClassName("d-none");
        setAlertMessage("");
        navigate("/");
      })
      .catch((err) => {
        setAlertClassName("alert-danger");
        setAlertMessage(err instanceof Error ? err.message : String(err));
      });
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        <Input
          title="Email Address"
          type="email"
          className="form-control"
          name="email"
          autoComplete="email-new"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          title="Password"
          type="password"
          className="form-control"
          name="password"
          autoComplete="password-new"
          onChange={(e) => setPassword(e.target.value)}
        />

        <hr />
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
    </div>
  );
};

export default Login;
