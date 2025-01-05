import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <>
            <NavDropdown.Item href="/auth/google">登入</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.1">註冊</NavDropdown.Item>
          </>
        );
      default:
        return <NavDropdown.Item href="/api/logout">登出</NavDropdown.Item>;
    }
  }

  render() {
    return (
      <Navbar expand="lg" className="sticky-top bg-warning  bg-opacity-75">
        <Container>
          <Navbar.Brand>
            <Link
              to={this.props.user ? "/surveys" : "/"}
              className="navbar-brand"
            >
              Helix
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">首頁</Nav.Link>
              <Nav.Link href="#link">所有採樣記錄</Nav.Link>
              <Nav.Link href="#link">新增品系</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <NavDropdown title="會員" id="basic-nav-dropdown">
                {this.renderContent()}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
