import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Station from "./pages/station/station";
import About from "./pages/about/about";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/*" component={Station} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
