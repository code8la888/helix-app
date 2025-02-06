import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="d-flex flex-column">
      <Header />

      <section
        className="container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          backgroundBlendMode: "overlay",
        }}
      >
        <h1 className="fw-bold text-black">
          智能化實驗數據管理，提升研究效率與數據準確性
        </h1>
        <p className="lead text-black fw-bold">
          透過數位化管理取代紙本與 Excel，提供即時數據同步、權限控管與數據可視化
        </p>

        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <Link to="/register" className="btn btn-lg btn-warning fw-bold">
            立即註冊
          </Link>
          <button className="btn btn-lg btn-info fw-bold">
            <ScrollLink
              to="about-section"
              smooth={true}
              duration={200}
              delay={0}
            >
              了解更多
            </ScrollLink>
          </button>
        </div>
      </section>

      <section
        id="about-section"
        className="container-fluid p-5"
        style={{ backgroundColor: "#e4eef5" }}
      >
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src="/images/Researchers-rafiki.svg"
              alt="Lab"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h2 className="text-black text-center display-4 fw-bold">
              關於 Helix LIMS
            </h2>
            <p className="text-black fs-5">
              在當今高度數據驅動的科研環境中，傳統的紙本記錄與 Excel
              管理容易造成數據不一致與資訊流失。
            </p>
            <p className="text-black fs-5">
              <strong>
                Helix LIMS（Laboratory Information Management
                System）實驗室資訊管理系統
              </strong>
              是專為
              <span className="text-primary">
                研究機構、生技公司、學術實驗室
              </span>
              設計的智慧實驗數據管理平台，幫助研究人員
              <strong>
                高效管理實驗計畫、即時追蹤樣本數據，並透過數據可視化提升決策準確性。
              </strong>
            </p>
          </div>
        </div>
      </section>

      <section
        className="container-fluid p-5"
        style={{ backgroundColor: "#c8d8e4" }}
      >
        <h2 className="text-center mb-4 text-black">核心功能</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {[
            { title: "線上申請", text: "簡化流程，取代紙本", icon: "📝" },
            { title: "樣本追蹤", text: "即時查看數據", icon: "🔍" },
            { title: "權限管理", text: "安全存取控制", icon: "🔒" },
            { title: "數據可視化", text: "圖表分析輔助決策", icon: "📊" },
          ].map((feature, index) => (
            <div key={index} className="col">
              <div
                className="card text-center h-100 shadow-sm"
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="card-body">
                  <h1>{feature.icon}</h1>
                  <h5 className="card-title text-black fw-bold">
                    {feature.title}
                  </h5>
                  <p className="card-text">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="container-fluid text-center py-5"
        style={{ backgroundColor: "#a4c8e1" }}
      >
        <h2 className="text-black">🚀 立即體驗智能化實驗管理！</h2>
        <p className="lead text-muted fw-bold">
          透過數據驅動的決策提升實驗室運營效率，立即註冊開始使用！
        </p>
        <Link to="/register" className="btn btn-lg btn-warning fw-bold">
          前往註冊
        </Link>
      </section>

      <Footer />
    </div>
  );
}
