import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => (
  <header className="header">
    <h1><Link to="/">Employee Management System </Link></h1>
  </header>
);

export default Header;
