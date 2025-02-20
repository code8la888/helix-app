import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormValidation } from "../hooks/useFormValidation";
import InputField from "../components/InputField";
import { sendFormData } from "../utils/sendFormData";

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
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;
    sendFormData(`/api/register`, formData, navigate);
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
                  src="https://res.cloudinary.com/ddmaqiu3h/image/upload/v1739640826/Blood_test-pana_jh4rlz.svg"
                  alt="register image"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h2 className="card-title mb-2 fw-bold">
                    歡迎來到 Helix LIMS
                  </h2>
                  <p className="mb-2">建立您的個人帳號</p>
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
                      placeholder="密碼長度應至少 8 碼以上"
                    />

                    <div className="d-grid gap-2 mt-4">
                      <button type="submit" className="button primary">
                        註冊
                      </button>
                    </div>
                  </form>
                  <p className="text-center mt-3 fw-bold">
                    已經有帳戶嗎?
                    <Link to="/login" className="link">
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
