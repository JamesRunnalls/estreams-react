import React, { Component } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CONFIG from "../../config.json";
import axios from "axios";
import "../../App.css";

class Station extends Component {
  state = {
    id: "",
    error: false,
  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    const url = new URL(window.location.href);
    const id = url.pathname.replace(/[^a-zA-Z0-9 ]/g, "");
    try {
      var { data } = await axios.get(
        `${CONFIG.estreams_bucket}/catchments/${id}.geojson`
      );
      console.log(data);
      this.setState({ id });
    } catch (e) {
      console.error(e);
      this.setState({ error: true, id });
    }
  }
  render() {
    var { id } = this.state;
    document.title = `${id} | EStreams`;
    return (
      <React.Fragment>
        <div className="main">
          <Header />
          Station
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Station;
