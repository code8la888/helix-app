import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-up";
import { FaChevronCircleUp } from "react-icons/fa";

function AppLayout() {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="mt-3 mb-3 container">
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
