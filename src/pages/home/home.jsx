import React, { Component } from "react";
import Select from "react-select";
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
import Station from "../../components/station";

class Home extends Component {
  state = {
    sidebar: false,
    basin_data: false,
    loading: true,
    selected: false,
    stations: false,
    station: false,
    providers: [],
    time: [],
  };
  updateProviderOptions = (event) => {
    var { stations } = this.state;
    this.closeBasin();
    const plotStations = this.plotStations;
    this.setState({ providers: event }, () => {
      plotStations(stations);
    });
  };
  updateTimeOptions = (event) => {
    var { stations } = this.state;
    this.closeBasin();
    const plotStations = this.plotStations;
    this.setState({ time: event }, () => {
      plotStations(stations);
    });
  };
  toggleStation = () => {
    this.setState({ station: !this.state.station });
  };
  closeStation = (event) => {
    if (!document.getElementById("station-inner").contains(event.target)) {
      this.setState({ station: false });
    }
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
    this.setState({ basin_data, sidebar: true, selected: id }, async () => {
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
      this.map.flyToBounds(bounds, {
        duration: 1,
      });
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
    this.setState({ basin_data: false, sidebar: false, selected: false });
  };
  filterStations = (stations) => {
    var { providers, time } = this.state;
    var filtered_stations = JSON.parse(JSON.stringify(stations));
    if (providers.length > 0) {
      filtered_stations.features = filtered_stations.features.filter((s) =>
        providers.map((p) => p.value).includes(s.properties.gauge_provider)
      );
    }
    if (time.length > 0) {
      filtered_stations.features = filtered_stations.features.filter((s) => {
        let result = false;
        for (let i = 0; i < time.length; i++) {
          if (result) break;
          let years = parseInt(s.properties.num_years);
          if (time[i].value.includes("<")) {
            if (
              years <= parseInt(time[i].value.slice(1, time[i].value.length))
            ) {
              result = true;
            }
          } else if (time[i].value.includes(">")) {
            if (
              years >= parseInt(time[i].value.slice(1, time[i].value.length))
            ) {
              result = true;
            }
          } else {
            let bounds = time[i].value.split("-");
            if (years >= parseInt(bounds[0]) && years <= parseInt(bounds[1])) {
              result = true;
            }
          }
        }
        return result;
      });
    }
    return filtered_stations;
  };
  plotStations = (stations) => {
    const setBasin = this.setBasin;
    const customIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/marker.png`,
      iconSize: [30, 32],
      iconAnchor: [15, 32],
      tooltipAnchor: [0, -32],
    });
    const geoJsonLayer = L.geoJSON(this.filterStations(stations), {
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
    this.stations.clearLayers();
    this.stations.addLayer(geoJsonLayer);
    this.map.flyToBounds(this.stations.getBounds(), {
      duration: 1,
    });
  };
  async componentDidMount() {
    this.map = L.map("map", {
      preferCanvas: true,
      zoomControl: false,
      center: [55, 17],
      zoom: 3,
      minZoom: 3,
      maxZoom: 12,
    });
    this.selectedMarker = null;
    this.hiddenMarker = null;
    this.stations = null;
    this.stations = L.markerClusterGroup().addTo(this.map);
    new L.Control.Zoom({ position: "topright" }).addTo(this.map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    window.setTimeout(async () => {
      const { data: stations } = await axios
        .get(`${CONFIG.estreams_bucket}/network.geojson`)
        .catch((error) => {
          console.error(error);
        });
      this.plotStations(stations);
      this.setState({ stations, loading: false });
    }, 0);
  }
  render() {
    document.title = "EStreams";
    const { basin_data, sidebar, loading, station, providers, time } =
      this.state;
    const provider_options = CONFIG["providers"].map((p) => {
      return { value: p, label: p };
    });
    const time_options = [
      { value: "<0.9", label: "0" },
      { value: "1-5", label: "1-5" },
      { value: "5-10", label: "5-10" },
      { value: "10-20", label: "10-20" },
      { value: "20-50", label: "20-50" },
      { value: "50-100", label: "50-100" },
      { value: ">100", label: ">100" },
    ];
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
            <div className="filters">
              <div className="filter">
                <Select
                  placeholder="Provider ID"
                  options={provider_options}
                  value={providers}
                  onChange={this.updateProviderOptions}
                  isMulti
                />
              </div>
              <div className="filter">
                <Select
                  placeholder="Data length (years)"
                  options={time_options}
                  value={time}
                  onChange={this.updateTimeOptions}
                  isMulti
                />
              </div>
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
                    <div className="open-station" onClick={this.toggleStation}>
                      More details
                    </div>
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
            <div
              className={station ? "station open" : "station"}
              onClick={this.closeStation}
            >
              {basin_data && (
                <div className="station-inner" id="station-inner">
                  <Station basin_data={basin_data} />
                  <div className="close" onClick={this.toggleStation}>
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
