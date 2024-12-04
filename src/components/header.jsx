import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import icon from "../img/icon.png";
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
        <NavLink className="about" to="about">
          ?
        </NavLink>
      </div>
    );
  }
}

export default Header;
