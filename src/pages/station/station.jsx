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
    metadata: false,
    selected: "station",
  };
  setSelected = (selected) => {
    this.setState({ selected });
  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    const url = new URL(window.location.href);
    const id = url.pathname.replace(/[^a-zA-Z0-9 ]/g, "");
    try {
      const { data: metadata } = await axios.get(
        `${CONFIG.estreams_bucket}/catchments/${id}.geojson`
      );
      this.setState({ id, metadata });
    } catch (e) {
      console.error(e);
      this.setState({ error: true, id });
    }
  }
  render() {
    var { id, metadata, error, selected } = this.state;
    console.log(metadata);
    document.title = `${id} | EStreams`;
    return (
      <React.Fragment>
        <div className="main">
          <Header />
          <div className="content">
            {metadata && (
              <React.Fragment>
                <h1>Station {id}</h1>
                <div className="horizontal-navigation">
                  <div
                    className={
                      selected === "station" ? "nav-item active" : "nav-item"
                    }
                    onClick={() => this.setSelected("station")}
                  >
                    Station info
                  </div>
                  <div
                    className={
                      selected === "data" ? "nav-item active" : "nav-item"
                    }
                    onClick={() => this.setSelected("data")}
                  >
                    Data info
                  </div>
                  <div
                    className={
                      selected === "provider" ? "nav-item active" : "nav-item"
                    }
                    onClick={() => this.setSelected("provider")}
                  >
                    Provider info
                  </div>
                  <div
                    className={
                      selected === "download" ? "nav-item active" : "nav-item"
                    }
                    onClick={() => this.setSelected("download")}
                  >
                    Download data
                  </div>
                </div>
                <div className="content-inner">
                  {["station", "data", "provider"].includes(selected) && (
                    <React.Fragment>
                      {Object.keys(CONFIG[selected]).map((key) => (
                        <div className="item">
                          <div className="item-key">
                            {CONFIG[selected][key]}:
                          </div>
                          <div className="item-value">
                            {key in metadata["features"][0]["properties"] ? (
                              metadata["features"][0]["properties"][
                                key
                              ].includes("https") ? (
                                <a
                                  href={
                                    metadata["features"][0]["properties"][key]
                                  }
                                >
                                  {metadata["features"][0]["properties"][key]}
                                </a>
                              ) : (
                                metadata["features"][0]["properties"][key]
                              )
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  )}
                  {selected === "download" && (
                    <React.Fragment>
                      <div className="download-buttons">
                        <a href={`${CONFIG.estreams_bucket}/data/${id}.zip`}>
                          Station data
                        </a>
                        <a
                          href={`${CONFIG.estreams_bucket}/catchments/${id}.geojson`}
                        >
                          Station metadata
                        </a>
                        <a href={`${CONFIG.estreams_bucket}/network.geojson`}>
                          Station metadata
                        </a>
                      </div>
                      <p>
                        The full dataset with data for all stations is available
                        at our{" "}
                        <a href="https://zenodo.org/records/13961394">
                          Zenodo repository
                        </a>
                        . Please refer to the{" "}
                        <a href="https://www.nature.com/articles/s41597-024-03706-1">
                          EStreams paper
                        </a>{" "}
                        (published at Nature Scientific Data), for a detailed
                        description of the current dataset, including their
                        respective variables units.
                      </p>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
            {error && (
              <React.Fragment>
                <h1>Station "{id}" not found.</h1>
              </React.Fragment>
            )}
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Station;
