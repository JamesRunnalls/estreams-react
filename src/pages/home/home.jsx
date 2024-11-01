import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import L from "leaflet";
import "leaflet.markercluster";
import "./css/leaflet.css";
import "./css/markercluster.css";
import "./css/markerclusterdefault.css";
import icon from "../../img/icon.png";
import eawag from "../../img/eawag.png";
import uzh from "../../img/uzh.png";
import tudelft from "../../img/tudelft.png";
import "../../App.css";

class Home extends Component {
  state = {
    sidebar: false,
    basin_data: false,
    loading: true,
  };
  setBasin = async (e) => {
    try {
      this.map.removeLayer(this.basin);
    } catch (e) {}
    const latlng = e.latlng;
    const id = e.target.options.id;
    const { data } = await axios
      .get(
        `https://estreams.s3.eu-central-1.amazonaws.com/catchments/${id}.geojson`
      )
      .catch((error) => {
        console.error(error);
      });
    var basin_data = data["features"][0]["properties"];
    basin_data["basin_id"] = id;
    this.setState({ basin_data, sidebar: true }, async () => {
      this.basin = L.geoJSON(data["features"][0], {
        style: function (feature) {
          return {
            fillColor: "blue",
            weight: 1,
            opacity: 1,
            color: "blue",
            fillOpacity: 0.2,
          };
        },
      });
      this.map.addLayer(this.basin);
      var bounds = this.basin.getBounds();
      this.map.fitBounds(bounds);
    });
  };
  closeBasin = () => {
    try {
      this.map.removeLayer(this.basin);
    } catch (e) {}
    this.setState({ basin_data: false, sidebar: false });
  };
  plotStations = async () => {
    const setBasin = this.setBasin;
    const { data } = await axios
      .get("https://estreams.s3.eu-central-1.amazonaws.com/network.geojson")
      .catch((error) => {
        console.error(error);
      });
    const customIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/marker.png`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      tooltipAnchor: [0, -32],
    });

    const markers = L.markerClusterGroup();
    const geoJsonLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(feature.properties.basin_id, {
          direction: "top",
        });
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: customIcon,
          id: feature.properties.basin_id,
        }).on("click", setBasin);
      },
    });
    markers.addLayer(geoJsonLayer);
    this.map.addLayer(markers);
    this.map.flyToBounds(markers.getBounds());
    this.setState({ loading: false });
  };
  async componentDidMount() {
    this.map = L.map("map", {
      preferCanvas: true,
      zoomControl: false,
      center: [55, 17],
      zoom: 3,
      minZoom: 3,
    });
    L.control
      .attribution({
        position: "bottomleft",
      })
      .addTo(this.map);
    new L.Control.Zoom({ position: "topright" }).addTo(this.map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    window.setTimeout(() => {
      this.plotStations();
    }, 0);
  }
  render() {
    document.title = "EStreams";
    const { basin_data, sidebar, loading } = this.state;
    return (
      <React.Fragment>
        <div className="main">
          <div className="icon">
            <img src={icon} />
            <div className="description">
              An integrated dataset and catalogue of streamflow, hydro-climatic
              and landscape variables for Europe.
            </div>
          </div>
          <div className={sidebar ? "sidebar open" : "sidebar"}>
            {basin_data && (
              <div className="sidebar-inner">
                <div className="properties">
                  {Object.entries(basin_data).map(([key, value]) => (
                    <div key={key} className="property">
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
                <div className="contact">
                  Check{" "}
                  <a href="https://www.nature.com/articles/s41597-024-03706-1">
                    here
                  </a>{" "}
                  for more information about the Estreams project and describing
                  paper. © 2024. Contact the author with questions or comments.
                  Open dataset at{" "}
                  <a href="https://zenodo.org/records/13154470">Zenodo</a>.
                </div>
                <div className="close" onClick={this.closeBasin}>
                  Close
                </div>
              </div>
            )}
          </div>
          <div className={sidebar ? "map small" : "map"}>
            {loading && <span class="loader"></span>}
            <div id="map" />
          </div>
          <div className="footer">
            <img src={eawag} style={{ height: 50 }} />
            <img src={uzh} style={{ height: 50 }} />
            <img src={tudelft} style={{ height: 70, paddingBottom: 5 }} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
