import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SiHelix } from "react-icons/si";

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link wh" to="/login">
                登入
              </Link>
            </li>
            <li className="nav-item ">
              <Link className="nav-link wh" to="/register">
                註冊
              </Link>
            </li>
          </>
        );
      default:
        return (
          <li className="nav-item">
            <a className="nav-link wh" href="/api/logout">
              登出
            </a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg "
        style={{ backgroundColor: "rgb(6, 60, 139)" }}
      >
        <div className="container">
          <Link
            className="navbar-brand wh"
            to={this.props.user ? "/surveys" : "/"}
          >
            <SiHelix />
            Helix
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon wh"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link wh" to="/strain/new">
                  新增品系
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link wh" to="/strains/index">
                  查看所有品系
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">{this.renderContent()}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
