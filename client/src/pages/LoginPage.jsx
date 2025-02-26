import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/auth/authActions";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormValidation } from "../hooks/useFormValidation";
import InputField from "../components/InputField";

export default function LoginPage() {
  const [userinfo, setUserInfo] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { validated, validateForm } = useFormValidation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/login`, userinfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        dispatch(fetchUser());
        toast("歡迎回來!");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "登入失敗，請稍後再試！");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error("伺服器無回應或發生錯誤，請稍後再試。");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = (event) => {
    event.preventDefault();
    setLoading(true);
    window.location.href = "/auth/google";
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "var(--theme-color)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center p-5">
          <div className="card border-light rounded-3">
            <div className="row g-0 align-items-center">
              <div className="col-md-6 p-5">
                <img
                  src="https://res.cloudinary.com/ddmaqiu3h/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1739640825/Computer_login-rafiki_a8w5sd.svg"
                  alt="login page"
                  className="img-fluid rounded-starts p-3"
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h2 className="card-title text-center mb-2 fw-bold">登入</h2>
                  <form
                    onSubmit={handleLogin}
                    className={`validated-form ${
                      validated ? "was-validated" : ""
                    }`}
                  >
                    <InputField
                      label="使用者信箱"
                      id="username"
                      name="username"
                      value={userinfo.username}
                      onChange={handleChange}
                      autoComplete="username"
                    />

                    <InputField
                      label="密碼"
                      type="password"
                      id="password"
                      name="password"
                      value={userinfo.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />

                    <div className="d-grid gap-2 mt-4">
                      <button
                        className="warning"
                        disabled={loading}
                        type="submit"
                      >
                        登入
                      </button>
                    </div>
                  </form>
                  <hr />
                  <form onSubmit={handleGoogleAuth}>
                    <div className="d-grid gap-2 mt-4">
                      <button className="danger" disabled={loading}>
                        使用 Google 帳號登入
                      </button>
                    </div>
                  </form>
                  <p className="text-center mt-3 fw-bold">
                    還沒有帳戶嗎?
                    <Link to="/register" className="link">
                      &nbsp;註冊
                    </Link>
                  </p>
                  <p className="text-center mt-3 fw-bold">
                    <Link to="/" className="link">
                      返回首頁🧬
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
