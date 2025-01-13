import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [userinfo, setUserInfo] = useState({ username: "", password: "" });
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
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

    try {
      const res = await axios.post(`/api/login`, userinfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.redirect) {
        navigate(res.data.redirect);
      } else {
        console.log("資料送出成功:", res.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("伺服器返回錯誤:", error.response.data);
        console.error("HTTP 狀態碼:", error.response.status);
      } else if (error.request) {
        console.error("沒有收到伺服器回應:", error.request);
      } else {
        console.error("發送失敗:", error.message);
      }
    }
  };
  return (
    <div className="row">
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
            <button className="btn btn-success btn-block">登入</button>
          </div>
        </form>
        <hr />
        <form action="/auth/google">
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-danger btn-block">使用google登入</button>
          </div>
        </form>
      </div>
    </div>
  );
}
