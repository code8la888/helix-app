import React from "react";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-center mb-3">使用者註冊</h1>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <form
            action="/api/register"
            method="POST"
            className="validated-form"
            noValidate
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
