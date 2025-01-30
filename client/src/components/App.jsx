import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../actions";
import Loader from "./Loader";
import HomePage from "../pages/HomePage";
// import * as actions from "../actions";

// import ProtectedRoute from "./ProtectedRoute";
// import AppLayout from "./AppLayout";
// import LoginPage from "../pages/LoginPage";
// import Landing from "./Landing";
// import RegisterPage from "../pages/RegisterPage";
// import Index from "../pages/strains/Index";
// import NewStrain from "../pages/strains/NewStrain";
// import StrainDetails from "../pages/strains/StrainDetails";
// import EditStrain from "../pages/strains/EditStrain";
// import NewMice from "../pages/mice/NewMice";
// import NewBreedingRecord from "../pages/breedingRecords/NewBreedingRecord";
// import EditBreedingRecord from "../pages/breedingRecords/EditBreedingRecord";
// import EditMice from "../pages/mice/EditMice";
// import ErrorPage from "../pages/ErrorPage";
// import ProfilePage from "../pages/ProfilePage";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const AppLayout = lazy(() => import("./AppLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const Landing = lazy(() => import("./Landing"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const Index = lazy(() => import("../pages/strains/Index"));
const NewStrain = lazy(() => import("../pages/strains/NewStrain"));
const StrainDetails = lazy(() => import("../pages/strains/StrainDetails"));
const EditStrain = lazy(() => import("../pages/strains/EditStrain"));
const NewMice = lazy(() => import("../pages/mice/NewMice"));
const NewBreedingRecord = lazy(() =>
  import("../pages/breedingRecords/NewBreedingRecord")
);
const EditBreedingRecord = lazy(() =>
  import("../pages/breedingRecords/EditBreedingRecord")
);
const EditMice = lazy(() => import("../pages/mice/EditMice"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader content="" />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />}></Route>
          {/* <Route path="/error" element={<ErrorPage />} /> */}

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Landing />} />
            <Route path="strains/index" element={<Index />} />
            <Route path="strains/new" element={<NewStrain />} />
            <Route path="strains/:id" element={<StrainDetails />} />
            <Route path="strains/:id/edit" element={<EditStrain />} />
            <Route path="strains/:id/mice/new" element={<NewMice />} />
            <Route
              path="strains/:strainId/breedingRecord/:breedingRecordId/edit"
              element={<EditBreedingRecord />}
            />
            <Route
              path="strains/:strainId/mice/:mouseId/edit"
              element={<EditMice />}
            />
            <Route
              path="strains/:id/breedingRecord/new"
              element={<NewBreedingRecord />}
            />
            <Route path="profile" element={<ProfilePage />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
