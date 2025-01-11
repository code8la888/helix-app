import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <>
            <Nav.Link href="/login">登入</Nav.Link>
            <Nav.Link href="/register">註冊</Nav.Link>
          </>
        );
      default:
        return <Nav.Link href="/api/logout">登出</Nav.Link>;
    }
  }

  render() {
    return (
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{ backgroundColor: "var(--bs-success-border-subtle)" }}
      >
        <Container>
          <Navbar.Brand>
            <Link
              to={this.props.user ? "/surveys" : "/"}
              className="navbar-brand"
            >
              Helix
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/strain/new">新增品系</Nav.Link>
              <Nav.Link href="/index">查看所有品系</Nav.Link>
            </Nav>
            <Nav className="ms-auto">{this.renderContent()}</Nav>
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
