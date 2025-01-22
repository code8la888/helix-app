import React, { useState } from "react";
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
        window.location.href = res.data.redirect; // 導航到伺服器指定的頁面
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
        backgroundImage: "linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center p-5">
          <div className="card border-light rounded-3">
            <div className="row g-0 align-items-center">
              <div className="col-md-6">
                <img
                  src="../../public/undraw_access-account_aydp.svg"
                  alt="..."
                  className="img-fluid rounded-starts p-3"
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h2 className="card-title text-center">註冊</h2>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={`validated-form ${
                      validated ? "was-validated" : ""
                    }`}
                  >
                    <InputField
                      label="使用者名稱"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />

                    <InputField
                      label="使用者信箱"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <InputField
                      label="連絡電話"
                      id="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleChange}
                    />

                    <InputField
                      label="計畫單位"
                      id="dept"
                      name="dept"
                      value={formData.dept}
                      onChange={handleChange}
                    />
                    <div className="mb-3">
                      <label className="form-label" htmlFor="role">
                        職稱:
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
                      <div className="valid-feedback">看起來不錯</div>
                    </div>
                    <InputField
                      label="密碼"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <div className="d-grid gap-2">
                      <button className="btn btn-success">註冊</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
