import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <section className="container-fluid p-5">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {[
          { title: "數據查詢", href: "/strains/index", icon: "📊" },
          { title: "計畫申請", href: "/strains/new", icon: "✒️" },
          { title: "個人資訊", href: "/profile", icon: "👤" },
          { title: "參考資料", href: "/references", icon: "📖" },
        ].map((feature, index) => (
          <div key={index} className="col">
            <div
              className="card text-center h-100"
              style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="card-body">
                <Link
                  to={feature.href}
                  style={{ textDecoration: "none", color: "rgb(6, 60, 139)" }}
                >
                  <h1>{feature.icon}</h1>
                  <h5 className="card-title text-black fw-bold">
                    {feature.title}
                  </h5>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
