function Footer() {
  return (
    <div className="column">
      <div className="footerImage text-center">
        <img src="/images/footerImage.png" alt="" style={{ width: "50%" }} />
      </div>
      <div
        className="footer py-3 mt-auto text-center wh"
        style={{
          backgroundColor: "rgb(6, 60, 139)",
        }}
      >
        <span>&copy; Helix LIMS 2024</span>
      </div>
    </div>
  );
}

export default Footer;
