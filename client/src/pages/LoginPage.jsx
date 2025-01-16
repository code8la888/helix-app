import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../actions/index";
import axios from "axios";

export default function LoginPage() {
  const [userinfo, setUserInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/strains/index";
  console.log(from);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`/api/login`, userinfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        dispatch(fetchUser());
        setSuccess(res.data.message || "登入成功！");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "登入失敗，請稍後再試！");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setError("伺服器無回應或發生錯誤，請稍後再試。");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
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
    <>
      {success && (
        <div
          className="alert alert-success position-fixed top-0 start-50 translate-middle-x"
          role="alert"
          style={{ zIndex: 1050, marginTop: "20px" }}
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger position-fixed top-0 start-50 translate-middle-x"
          role="alert"
          style={{ zIndex: 1050, marginTop: "20px" }}
        >
          {error}
        </div>
      )}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: "linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center p-5">
            <div class="card border-light rounded-3">
              <div class="row g-0 align-items-center">
                <div class="col-md-6">
                  <img
                    src="../../public/undraw_access-account_aydp.svg"
                    alt="..."
                    className="img-fluid rounded-starts p-3"
                  />
                </div>
                <div class="col-md-6">
                  <div className="card-body">
                    <h2 className="card-title text-center">登入</h2>
                    <form
                      onSubmit={handleLogin}
                      className={`validated-form ${
                        validated ? "was-validated" : ""
                      }`}
                    >
                      <div className="mb-3">
                        <label className="form-label" htmlFor="username">
                          使用者名稱:
                        </label>
                        <input
                          className="form-control rounded-pill"
                          type="text"
                          id="username"
                          name="username"
                          value={userinfo.username}
                          onChange={handleChange}
                          required
                        />
                        <div className="valid-feedback">looks good</div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" htmlFor="password">
                          密碼:
                        </label>
                        <input
                          className="form-control rounded-pill"
                          type="password"
                          id="password"
                          name="password"
                          value={userinfo.password}
                          onChange={handleChange}
                          required
                        />
                        <div className="valid-feedback">looks good</div>
                      </div>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-block rounded-pill btn-outline-primary"
                          disabled={loading}
                        >
                          登入
                        </button>
                      </div>
                    </form>
                    <hr />
                    <form onSubmit={handleGoogleAuth}>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-block rounded-pill btn-outline-danger"
                          disabled={loading}
                        >
                          使用 Google 帳號登入
                        </button>
                      </div>
                    </form>
                    <p className="text-center mt-3">
                      還沒有帳戶嗎?
                      <Link to="/register" style={{ textDecoration: "none" }}>
                        &nbsp;註冊
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
