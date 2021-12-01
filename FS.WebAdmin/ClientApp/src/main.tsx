import "./styles/main.scss";
import { Component } from "react";
import ReactDOM from "react-dom";

class AppContainer extends Component {
  render() {
    return <h1>Hello</h1>;
  }
}

ReactDOM.render(<AppContainer />, document.getElementById("app"));
