import Header from "./Header";
import Footer from "./Footer";
import Container from "react-bootstrap/Container";
import ScrollToTop from "react-scroll-up";
import { FaChevronCircleUp } from "react-icons/fa";

function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <main>
        <Container className="mt-3 mb-3">{children}</Container>
      </main>
      <Footer />
      <ScrollToTop showUnder={150}>
        <span>
          <FaChevronCircleUp
            style={{
              fontSize: "40",
              color: "rgb(139, 185, 254)",
            }}
          />
        </span>
      </ScrollToTop>
    </div>
  );
}
export default AppLayout;
