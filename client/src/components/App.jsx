import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import AppLayout from "./AppLayout";
import LoginPage from "../pages/LoginPage";
import Landing from "./Landing";
import RegisterPage from "../pages/RegisterPage";
import Index from "../pages/strains";
import NewStrain from "../pages/strains/NewStrain";
import StrainDetails from "../pages/strains/StrainDetails";
import EditStrain from "../pages/strains/EditStrain";
import NewMice from "../pages/mice/NewMice";
import NewBreedingRecord from "../pages/breedingRecords/NewBreedingRecord";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/index" element={<Index />} />
            <Route path="/strain/new" element={<NewStrain />} />
            <Route path="/strains/:id" element={<StrainDetails />} />
            <Route path="/strains/:id/edit" element={<EditStrain />} />
            <Route path="/strains/:id/mice/new" element={<NewMice />} />
            <Route
              path="/strains/:id/breedingRecord/new"
              element={<NewBreedingRecord />}
            />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
