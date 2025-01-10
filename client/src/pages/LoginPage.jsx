import React from "react";

export default function LoginPage() {
  return (
    <div className="row">
      <h1 className="text-center">登入</h1>
      <div className="col-md-4 offset-md-4">
        <form action="/api/login" method="POST">
          <div className="mb-3">
            <label className="form-label" htmlFor="username">
              使用者信箱:
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

          <div className="mb-4">
            <label className="form-label" htmlFor="password">
              密碼:
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
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
