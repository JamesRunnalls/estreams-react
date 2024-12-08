import React, { Component } from "react";
import eawag from "../img/eawag.png";
import uzh from "../img/uzh.png";
import tudelft from "../img/tudelft.png";
import "../App.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <a
          href="https://www.eawag.ch/en/department/siam/projects/estreams/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={eawag} style={{ height: 30 }} />
        </a>
        <a href="https://www.uzh.ch/" target="_blank" rel="noopener noreferrer">
          <img src={uzh} style={{ height: 40 }} />
        </a>
        <a
          href="https://www.tudelft.nl/en/ceg/about-faculty/departments/watermanagement/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tudelft} style={{ height: 40, paddingBottom: 0 }} />
        </a>
      </div>
    );
  }
}

export default Footer;
