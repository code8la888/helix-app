import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ScrollUpTop from "./ScrollUpTop";

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // 路由切換時，滾動到新頁面頂部，避免在新頁面保留舊的滾動位置

  return (
    <div id="pageTop">
      <Header />
      <main>
        <div className="my-3 container">
          <Outlet />
          {/*Reacter Router 負責將子路由的 element（如 <Index />）傳遞給父路由的 <Outlet />。Outlet 會接收子路由的組件*/}
        </div>
      </main>
      <Footer />
      <ScrollUpTop />
    </div>
  );
}
export default AppLayout;
