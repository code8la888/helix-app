import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormValidation } from "../hooks/useFormValidation";
import InputField from "../components/InputField";
import { sendFormData } from "../utils/sendFormData";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    dept: "",
    tel: "",
    role: "委託人",
    username: "", //使用者信箱
    name: "", //使用者姓名
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
                        className="col-12 col-md-6"
                        label="使用者名稱"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="單位"
                        id="dept"
                        name="dept"
                        value={formData.dept}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <InputField
                        className="col-12 col-md-6"
                        label="連絡電話"
                        id="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                      />

                      <div className="mb-2 col-12 col-md-6">
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
                          <option value="委託人">委託人</option>
                          <option value="計畫管理人">計畫管理人</option>
                          <option value="獸醫">獸醫</option>
                        </select>
                      </div>
                    </div>
                    <InputField
                      label="使用者信箱"
                      id="username"
                      name="username"
                      value={formData.username}
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
