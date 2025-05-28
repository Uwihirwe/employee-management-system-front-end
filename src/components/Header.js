import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <h1>
        <Link to="/">Employee Management</Link>
      </h1>
      {isAuthenticated ? (
        <nav className="nav-links">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      ) : (
        <nav className="nav-links">
          {/* <Link to="/login">Login</Link>
          <Link to="/register">Register</Link> */}
        </nav>
      )}
    </header>
  );
};

export default Header;
