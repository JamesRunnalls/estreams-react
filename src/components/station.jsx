import React, { Component } from "react";
import CONFIG from "../config.json";
import "../App.css";

class Station extends Component {
  state = {
    selected: "station",
  };
  setSelected = (selected) => {
    this.setState({ selected });
  };
  render() {
    var { selected } = this.state;
    var { basin_data } = this.props;
    return (
      <React.Fragment>
        <h1>{basin_data["basin_id"]}</h1>
        <div className="horizontal-navigation">
          <div
            className={selected === "station" ? "nav-item active" : "nav-item"}
            onClick={() => this.setSelected("station")}
          >
            Station info
          </div>
          <div
            className={selected === "data" ? "nav-item active" : "nav-item"}
            onClick={() => this.setSelected("data")}
          >
            Data info
          </div>
          <div
            className={selected === "provider" ? "nav-item active" : "nav-item"}
            onClick={() => this.setSelected("provider")}
          >
            Provider info
          </div>
          <div
            className={selected === "download" ? "nav-item active" : "nav-item"}
            onClick={() => this.setSelected("download")}
          >
            Download data
          </div>
        </div>
        <div className="content-inner">
          {["station", "data", "provider"].includes(selected) && (
            <React.Fragment>
              {Object.keys(CONFIG[selected])
                .filter((k) => basin_data[k] !== "nan")
                .map((key) => (
                  <div
                    className={
                      ["observations"].includes(key) ? "item wide" : "item"
                    }
                    key={key}
                  >
                    <div className="item-key">{CONFIG[selected][key]}:</div>
                    <div className="item-value">
                      {key in basin_data ? (
                        basin_data[key].slice(0, 4) === "http" ? (
                          <a
                            href={basin_data[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {basin_data[key]}
                          </a>
                        ) : (
                          <div>
                            {basin_data[key].split(";").map((part, index) => (
                              <React.Fragment key={index}>
                                {part}
                                <br />
                                <br />
                              </React.Fragment>
                            ))}
                          </div>
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
              <div className="download">
                <div className="title">
                  Data package for hydrological modeling
                </div>
                <p>
                  This zip file contains the available catchment attibutes and
                  meteorological daily data needed for hydrological modeling.
                </p>
                <a
                  href={`${CONFIG.estreams_bucket}/data/${basin_data["basin_id"]}.zip`}
                >
                  Download
                </a>
                <div className="title">All stations</div>
                <p>GeoJSON file of all 17,000+ stations.</p>
                <a href={`${CONFIG.estreams_bucket}/network.geojson`}>
                  Download
                </a>
                <div className="title">Streamflow data</div>
                <p>
                  We are unable to provide the streamflow data directly due to
                  data use restrictions. Please see <b>Provider info</b> for
                  information on how to access the data directly. 
                </p>
              </div>
              <p>
                The full dataset with data for all stations is available at our{" "}
                <a
                  href="https://zenodo.org/records/13961394"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zenodo repository
                </a>
                . Please refer to the{" "}
                <a
                  href="https://www.nature.com/articles/s41597-024-03706-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  EStreams paper
                </a>{" "}
                (published at Nature Scientific Data), for a detailed
                description of the current dataset, including their respective
                variables units.
              </p>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Station;
