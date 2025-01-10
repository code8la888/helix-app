import React, { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    dept: "",
    tel: "",
    role: "",
    username: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    const registerData = { ...formData };
    try {
      const res = await axios.post("/api/register", registerData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.redirect) {
        window.location.href = res.data.redirect; // 導航到伺服器指定的頁面
      } else {
        console.log("資料送出成功:", res.data);
      }
    } catch (error) {
      if (error.response) {
        // 如果伺服器返回錯誤響應
        console.error("伺服器返回錯誤:", error.response.data);
        console.error("HTTP 狀態碼:", error.response.status);
      } else if (error.request) {
        // 請求已發送但沒有收到回應
        console.error("沒有收到伺服器回應:", error.request);
      } else {
        // 請求設置錯誤
        console.error("發送失敗:", error.message);
      }
    }
  };
  return (
    <>
      <h1 className="text-center mb-3">使用者註冊</h1>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <form
            noValidate
            onSubmit={handleSubmit}
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                使用者名稱:
              </label>
              <input
                className="form-control"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                電子信箱:
              </label>
              <input
                className="form-control"
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="tel">
                連絡電話:
              </label>
              <input
                className="form-control"
                type="text"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="dept">
                單位:
              </label>
              <input
                className="form-control"
                type="text"
                id="dept"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good</div>
            </div>
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
              <div className="valid-feedback">looks good</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                密碼:
              </label>
              <input
                className="form-control"
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good</div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-success">註冊</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
