import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "react-scroll-up";
import { FaChevronCircleUp } from "react-icons/fa";
import { useEffect } from "react";

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <main className="flex-grow-1  d-flex align-items-center justify-content-center">
        <div className="my-3 container">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollToTop showUnder={150}>
        <span>
          <FaChevronCircleUp
            style={{
              fontSize: 40,
              color: "rgb(139, 185, 254)",
            }}
          />
        </span>
      </ScrollToTop>
    </div>
  );
}
export default AppLayout;
