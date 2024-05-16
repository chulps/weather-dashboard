import React from "react";
import logo from "../images/logo.gif";
import '../css/footer.css'

const Footer = () => {
  return (
    <footer>
        <img className="logo" src={logo} alt="© Chuck Howard" />
        <small>© Chuck Howard 2024</small>
    </footer>
  );
};

export default Footer;
