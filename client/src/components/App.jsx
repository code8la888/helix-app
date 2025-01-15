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
import EditMice from "../pages/mice/EditMice";
import ErrorPage from "../pages/ErrorPage";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const isLoggedIn = !!this.props.auth;

    return (
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/index"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strain/new"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <NewStrain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:id"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <StrainDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:id/edit"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <EditStrain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:id/mice/new"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <NewMice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:strainId/breedingRecord/:breedingRecordId/edit"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <EditBreedingRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:strainId/mice/:mouseId/edit"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <EditMice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/strains/:id/breedingRecord/new"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <NewBreedingRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/error"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ErrorPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(App);
