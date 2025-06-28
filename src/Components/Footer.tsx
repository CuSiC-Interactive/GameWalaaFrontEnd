import { Link } from "react-router-dom";
import "./Footer.css"; // Make sure the path is correct

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/About">About</Link>
      <Link to="/terms-and-conditions">Terms & Conditions</Link>
      <Link to="/privacy-policy">Privacy Policy</Link>
    </footer>
  );
};

export default Footer;
