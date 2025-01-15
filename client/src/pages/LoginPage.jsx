import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const from = location.state?.from?.pathname || "/index";
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
        }, 1000);
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
    <div className="row">
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h1 className="text-center">登入</h1>
      <div className="col-md-4 offset-md-4">
        <form
          onSubmit={handleLogin}
          className={`validated-form ${validated ? "was-validated" : ""}`}
        >
          <div className="mb-3">
            <label className="form-label" htmlFor="username">
              使用者信箱:
            </label>
            <input
              className="form-control"
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
              className="form-control"
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
            <button className="btn btn-success btn-block" disabled={loading}>
              登入
            </button>
          </div>
        </form>
        <hr />
        <form onSubmit={handleGoogleAuth}>
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-danger btn-block" disabled={loading}>
              使用 Google 登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
