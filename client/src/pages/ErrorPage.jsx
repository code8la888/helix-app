import { useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.error || "未知錯誤，請稍後再試。";
  const errorStack = location.state?.stack || "未提供詳細錯誤資訊";

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 p-5">
      <div className="alert alert-danger" role="alert">
        <h4>{errorMessage}</h4>
        {isDevelopment && errorStack && (
          <div className="mt-3">
            <hr />
            <pre className="text-wrap" style={{ color: "rgb(88, 21, 28)" }}>
              {errorStack}
            </pre>
          </div>
        )}
      </div>
      <div className="text-center">
        <button
          className=""
          style={{ backgroundColor: "var(--bs-danger-bg-subtle)" }}
          onClick={() => navigate("/strains/index")}
        >
          返回
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
