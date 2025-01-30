import React, { Component } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import logo from "../../img/logo.png";
import "../../App.css";

class About extends Component {
  state = {};

  render() {
    document.title = "About | EStreams";
    return (
      <React.Fragment>
        <div className="main">
          <Header />
          <div className="content">
            <div className="about-logo">
              <img src={logo} alt="logo" className="logo" />
            </div>

            <p>
              EStreams is an extensive catalog of openly available stream
              records, along with a dataset of hydro-climatic variables and
              landscape descriptors for +17,000 European catchments. It spans up
              to 120 years of records. The catalog provides detailed guidance,
              enabling users to directly access the sources of streamflow used.
              Additionally, the dataset comprises catchment-aggregated
              hydro-climatic indices and signatures, as well as landscape
              attributes and meteorological records.
            </p>
            <div className="authors">
              Thiago Nascimento, Julia Rudlang, Marvin Hoege, Ruud van der Ent,
              Máté Chappon, Jan Seibert, Markus Hrachowitz and Fabrizio Fenicia
            </div>
            <p>
              Check{" "}
              <a href="https://www.nature.com/articles/s41597-024-03706-1">
                here
              </a>{" "}
              for more information about the EStreams project and describing
              paper. Contact the{" "}
              <a href="https://www.eawag.ch/en/about-us/portrait/organisation/staff/profile/thiago-victor-nascimento/show/">
                author
              </a>{" "}
              with questions of comments. Open dataset at{" "}
              <a href="https://zenodo.org/records/13961394">Zenodo</a>.
            </p>
            <div className="developer">
              Website developed by <a href="https://www.eawag.ch/en/about-us/portrait/organisation/staff/profile/james-runnalls/show/">James Runnalls</a> @ Eawag
            </div>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default About;
