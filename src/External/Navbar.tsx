import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <img
          src="./Images/Arcade-wala.png"
          className="title"
          onClick={navigateHome}
        ></img>
        <div className="menu-icon" onClick={toggleNav}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`nav-elements ${showNav && "active"}`}>
          <ul>
            <li>
              <NavLink onClick={toggleNav} to="/Catalog">
                Games Catalog
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
