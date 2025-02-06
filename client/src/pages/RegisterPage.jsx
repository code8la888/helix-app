import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useFormValidation } from "../hooks/useFormValidation";
import { toast } from "react-toastify";
import InputField from "../components/InputField";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    dept: "",
    tel: "",
    role: "計畫主持人",
    username: "",
    password: "",
  });
  const { validated, validateForm } = useFormValidation();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    try {
      const res = await axios.post("/api/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message);
      if (res.data.redirect) {
        window.location.href = res.data.redirect;
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to top, #4b6cb7, #182848)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center p-5">
          <div className="card border-light rounded-3">
            <div className="row g-0 align-items-center">
              <div className="col-md-6 p-5">
                <img
                  src="/images/Blood test-pana.svg"
                  alt="register image"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h2
                    className="card-title mb-2 fw-bold"
                    style={{ color: " rgb(6, 60, 139)" }}
                  >
                    歡迎來到 Helix LIMS
                  </h2>
                  <p className="mb-2" style={{ color: " rgb(6, 60, 139)" }}>
                    建立您的個人帳號
                  </p>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={`validated-form ${
                      validated ? "was-validated" : ""
                    }`}
                  >
                    <div className="row">
                      <InputField
                        className="col"
                        label="使用者名稱"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <InputField
                        className="col"
                        label="單位"
                        id="dept"
                        name="dept"
                        value={formData.dept}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <InputField
                        className="col"
                        label="連絡電話"
                        id="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                      />

                      <div className="mb-2 col">
                        <label className="form-label" htmlFor="role">
                          <b>職稱</b>
                        </label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="role"
                          id="role"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="計畫主持人">計畫主持人</option>
                          <option value="學生">學生</option>
                          <option value="研究助理">研究助理</option>
                          <option value="品系管理人">品系管理人</option>
                          <option value="獸醫">獸醫</option>
                        </select>
                      </div>
                    </div>
                    <InputField
                      label="使用者信箱"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <InputField
                      label="密碼"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <div className="d-grid gap-2 mt-4">
                      <button
                        type="submit"
                        className="btn"
                        style={{
                          backgroundColor: " rgb(6, 60, 139)",
                          color: "white",
                        }}
                      >
                        註冊
                      </button>
                    </div>
                  </form>
                  <p className="text-center mt-3">
                    已經有帳戶嗎?
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      &nbsp;登入
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
