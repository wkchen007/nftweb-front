import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Oops!";
  let message = "Sorry, an unexpected error has occurred.";

  if (isRouteErrorResponse(error)) {
    // React Router 錯誤，如 404 / 500
    title = `Error ${error.status}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    // 一般 JS 錯誤
    message = error.message;
  }

  return (
    <div className="container text-center" style={{ marginTop: "4rem" }}>
      <h1 className="mb-3">{title}</h1>
      <p>{message}</p>
      <hr className="mb-4" />
      <Link to="/" className="btn btn-primary">
        返回首頁
      </Link>
    </div>
  );
}
