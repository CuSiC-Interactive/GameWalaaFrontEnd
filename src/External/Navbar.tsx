import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="title">GameWalaa</div>
        <div className="menu-icon" onClick={toggleNav}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`nav-elements ${showNav && "active"}`}>
          <ul>
            <li>
              <NavLink onClick={toggleNav} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink onClick={toggleNav} to="/Catalog">
                Games Catalog
              </NavLink>
            </li>
            <li>
              <NavLink onClick={toggleNav} to="/About">
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
