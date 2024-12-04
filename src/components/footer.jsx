import React, { Component } from "react";
import eawag from "../img/eawag.png";
import uzh from "../img/uzh.png";
import tudelft from "../img/tudelft.png";
import "../App.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <img src={eawag} style={{ height: 30 }} />
        <img src={uzh} style={{ height: 40 }} />
        <img src={tudelft} style={{ height: 40, paddingBottom: 0 }} />
      </div>
    );
  }
}

export default Footer;
