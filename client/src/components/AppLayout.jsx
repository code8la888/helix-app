import Header from "./Header";
import Footer from "./Footer";
import Container from "react-bootstrap/Container";

function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <main>
        <Container className="mt-3 mb-3">{children}</Container>
      </main>
      <Footer />
    </div>
  );
}
export default AppLayout;
