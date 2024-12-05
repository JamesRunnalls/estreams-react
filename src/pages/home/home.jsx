import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CONFIG from "../../config.json";
import download from "../../img/download.png";
import "leaflet.markercluster";
import "./css/leaflet.css";
import "./css/markercluster.css";
import "./css/markerclusterdefault.css";
import "../../App.css";

class Home extends Component {
  state = {
    sidebar: false,
    basin_data: false,
    loading: true,
  };
  setBasin = async (event) => {
    if (this.hiddenMarker) {
      this.stations.addLayer(this.hiddenMarker);
      this.hiddenMarker = null;
    }
    const marker = event.target;
    const latLng = marker.getLatLng();
    try {
      this.map.removeLayer(this.basin);
    } catch (e) {}
    const id = event.target.options.id;
    this.stations.removeLayer(marker);
    this.hiddenMarker = marker;
    const redIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/marker_red.png`,
      iconSize: [45, 50],
      iconAnchor: [22.5, 50],
      tooltipAnchor: [0, -50],
    });

    if (this.selectedMarker) {
      this.selectedMarker.remove();
      this.selectedMarker = null;
    }
    this.selectedMarker = L.marker([latLng.lat, latLng.lng], {
      icon: redIcon,
    }).addTo(this.map);

    const { data } = await axios
      .get(`${CONFIG.estreams_bucket}/catchments/${id}.geojson`)
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
    if (this.selectedMarker) {
      this.selectedMarker.remove();
      this.selectedMarker = null;
    }
    if (this.hiddenMarker) {
      this.stations.addLayer(this.hiddenMarker);
      this.hiddenMarker = null;
    }
    this.setState({ basin_data: false, sidebar: false });
  };
  plotStations = async () => {
    const setBasin = this.setBasin;
    const { data } = await axios
      .get(`${CONFIG.estreams_bucket}/network.geojson`)
      .catch((error) => {
        console.error(error);
      });
    const customIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/marker.png`,
      iconSize: [30, 32],
      iconAnchor: [15, 32],
      tooltipAnchor: [0, -32],
    });
    this.stations = L.markerClusterGroup();
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
    this.stations.addLayer(geoJsonLayer);
    this.map.addLayer(this.stations);
    this.map.flyToBounds(this.stations.getBounds());
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
    this.selectedMarker = null;
    this.hiddenMarker = null;
    this.stations = null;
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
          <Header />
          <div className="map">
            {loading && <span className="loader"></span>}
            <div id="map" />
            <div className="tagline">
              An integrated dataset and catalogue of streamflow, hydro-climatic
              and landscape variables for Europe.
            </div>
            <div className={sidebar ? "sidebar open" : "sidebar"}>
              {basin_data && (
                <div className="sidebar-inner">
                  <div className="title">{basin_data["basin_id"]}</div>
                  <div className="properties">
                    <div className="property">
                      <strong>Gauge ID:</strong> {basin_data["gauge_id"]}
                    </div>
                    <div className="property">
                      <strong>Catchment area:</strong>{" "}
                      {basin_data["area_estreams"]} km²
                    </div>
                    <div className="property">
                      <strong>Period of record:</strong>{" "}
                      {basin_data["record_period"]}
                    </div>
                    <div className="property">
                      <strong>Provider:</strong> {basin_data["provider_name"]}
                    </div>
                  </div>
                  <div className="buttons">
                    <NavLink
                      className="station"
                      to={`/${basin_data["basin_id"]}`}
                    >
                      Station page
                    </NavLink>
                    <a
                      href={`${CONFIG.estreams_bucket}/data/${basin_data["basin_id"]}.zip`}
                      className="download"
                      title="Download catchment data"
                    >
                      <img src={download} alt="Download" />
                    </a>
                  </div>
                  <div className="close" onClick={this.closeBasin}>
                    &#x2715;
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
