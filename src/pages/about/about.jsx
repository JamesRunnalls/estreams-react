import React, { Component } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../App.css";

class About extends Component {
  state = {};

  render() {
    document.title = "About | EStreams";
    return (
      <React.Fragment>
        <div className="main">
          <Header />
          About
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default About;
