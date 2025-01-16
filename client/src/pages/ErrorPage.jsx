import { useLocation, useNavigate } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.error || "未知錯誤，請稍後再試。";
  const errorStack = location.state?.stack || "";
  //   console.log(errorStack);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div>
      <div className="row align-items-center">
        <div className="col-8 offset-2 mt-4 ">
          <div className="alert alert-danger" role="alert">
            <h4>{errorMessage}</h4>
            {isDevelopment && errorStack && (
              <>
                <hr />
                <p>{errorStack}</p>
              </>
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
