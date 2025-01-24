import Container from "react-bootstrap/Container";
function Footer() {
  return (
    <footer
      className="footer py-3 mt-auto"
      style={{ backgroundColor: "rgb(6, 60, 139)" }}
    >
      <Container className="text-center wh">
        <span>&copy; Helix LIMS 2024</span>
      </Container>
    </footer>
  );
}

export default Footer;
