import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import AppLayout from "./AppLayout";
import LoginPage from "../pages/LoginPage";
import Landing from "./Landing";
import RegisterPage from "../pages/RegisterPage";
import Index from "../pages/strains";
import NewStrain from "../pages/strains/New";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <AppLayout>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/index" component={Index} />
          <Route exact path="/newStrain" component={NewStrain} />
        </AppLayout>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
