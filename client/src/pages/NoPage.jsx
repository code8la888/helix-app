import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <img
        src="https://res.cloudinary.com/ddmaqiu3h/image/upload/v1739640830/404_Error-pana_nij1rd.svg"
        alt="404 error image"
        style={{ maxWidth: "50%" }}
      />
      <div className="text-center">
        <button
          className="btn"
          style={{ backgroundColor: "var(--bs-danger-bg-subtle)" }}
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </div>
    </div>
  );
}
