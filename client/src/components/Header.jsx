import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SiHelix } from "react-icons/si";
import { useEffect } from "react";
import { fetchUser } from "../actions/authActions";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const renderContent = () => {
    if (auth === null) {
      return;
    }
    if (auth === false) {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link wh" to="/login">
              登入
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link wh" to="/register">
              註冊
            </Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link className="nav-link wh" to="/dashboard">
            我的儀表板
          </Link>
        </li>
        <li className="nav-item">
          <a className="nav-link wh" href="/api/logout">
            登出
          </a>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg header">
      <div className="container">
        <Link className="navbar-brand wh" to="/home">
          <SiHelix />
          Helix
        </Link>
        <button
          className={`navbar-toggler custom-toggler ${styles.navButton}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-list"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">{renderContent()}</ul>
        </div>
      </div>
    </nav>
  );
}
