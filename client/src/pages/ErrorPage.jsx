import { useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.error || "未知錯誤，請稍後再試。";
  const errorStack = location.state?.stack || "未提供詳細錯誤資訊";

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 mt-4 ">
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
              className="btn"
              style={{ backgroundColor: "var(--bs-danger-bg-subtle)" }}
              onClick={() => navigate("/strains/index")}
            >
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
