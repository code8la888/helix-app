import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ScrollUpTop from "./ScrollUpTop";

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div id="pageTop">
      <Header />
      <main>
        <div className="my-3 container">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollUpTop />
    </div>
  );
}
export default AppLayout;
