import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import icon from "../img/icon.png";
import home_icon from "../img/home.png";
import "../App.css";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="icon">
          <NavLink to="/">
            <img src={icon} />
          </NavLink>
        </div>
        <div className="links">
          <NavLink className="home" to="/" title="Home">
            <img src={home_icon} alt="home" />
          </NavLink>
          <NavLink className="about" to="about" title="About">
            ?
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Header;
