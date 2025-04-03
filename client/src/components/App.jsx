import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "./Loader";

const queryClient = new QueryClient();
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const AppLayout = lazy(() => import("./AppLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
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
const Dashboard = lazy(() => import("./Dashboard"));
const References = lazy(() => import("./References"));
const HomePage = lazy(() => import("../pages/HomePage"));
const NoPage = lazy(() => import("../pages/NoPage"));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* BrowseRouter 包裝整個應用程式 */}
        <Suspense fallback={<Loader />}>
          {/* 處理組件的lazy loading，當組件載入時顯示 <Loader /> 組件 */}
          <Routes>
            {/* Routes 是所有 Route 的父容器 */}
            <Route index element={<Navigate to="/home" replace />} />
            {/* index是特殊的路由，當訪問根路徑（/）時，會重定向到 /home 路徑 ，replace 會避免在瀏覽器歷史紀錄中留下根路徑 */}
            {/*Route 定義路徑和組件的關係 */}
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* ProtectedRoute 對根路徑和子路徑進行保護，只有通過驗證才可以進入這些路由 */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
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
              <Route path="references" element={<References />}></Route>
              <Route path="*" element={<NoPage />}></Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
