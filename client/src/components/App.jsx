import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./AppLayout";
import LoginPage from "../pages/LoginPage";
import Landing from "./Landing";
import RegisterPage from "../pages/RegisterPage";
import Index from "../pages/strains/Index";
import NewStrain from "../pages/strains/NewStrain";
import StrainDetails from "../pages/strains/StrainDetails";
import EditStrain from "../pages/strains/EditStrain";
import NewMice from "../pages/mice/NewMice";
import NewBreedingRecord from "../pages/breedingRecords/NewBreedingRecord";
import EditBreedingRecord from "../pages/breedingRecords/EditBreedingRecord";
import EditMiceCopy from "../pages/mice/EditMiceCopy";
import ErrorPage from "../pages/ErrorPage";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const isLoggedIn = !!this.props.auth;

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="*"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/strains/index" element={<Index />} />
                    <Route path="/strain/new" element={<NewStrain />} />
                    <Route path="/strains/:id" element={<StrainDetails />} />
                    <Route path="/strains/:id/edit" element={<EditStrain />} />
                    <Route path="/strains/:id/mice/new" element={<NewMice />} />
                    <Route
                      path="/strains/:strainId/breedingRecord/:breedingRecordId/edit"
                      element={<EditBreedingRecord />}
                    />
                    <Route
                      path="/strains/:strainId/mice/:mouseId/edit"
                      element={<EditMiceCopy />}
                    />
                    <Route
                      path="/strains/:id/breedingRecord/new"
                      element={<NewBreedingRecord />}
                    />
                    <Route path="/error" element={<ErrorPage />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(App);
