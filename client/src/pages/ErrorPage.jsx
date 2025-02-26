import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.error || "未知錯誤，請稍後再試。";
  const errorStack = location.state?.stack || "未提供詳細錯誤資訊";

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className={styles.background}>
      <div className={styles.contentBox}>
        <h1 className={styles.text}>OOPS!</h1>
        <div className={styles.errorMessage} role="alert">
          <h2>{errorMessage}</h2>
          {isDevelopment && errorStack && (
            <div>
              <hr />
              <pre className={styles.errorStack}>{errorStack}</pre>
            </div>
          )}
        </div>
        <div>
          <button
            className={styles.button}
            onClick={() => navigate("/strains/index")}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
