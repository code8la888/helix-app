import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import AppLayout from "./AppLayout";
import Dashboard from "./Dashboard";
import LoginPage from "../pages/LoginPage";
const SurveyNew = () => <h2>SurveyNew</h2>;
import Landing from "./Landing";
import RegisterPage from "../pages/RegisterPage";

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
          <Route exact path="/surveys" component={Dashboard} />
          <Route path="/surveys/new" component={SurveyNew} />
        </AppLayout>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
