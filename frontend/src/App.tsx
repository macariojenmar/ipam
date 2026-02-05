import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MuiThemeProvider } from "./theme/MuiThemeProvider";
import { LoadingFallback } from "./components/LoadingFallback";
import { PageList } from "./enums/pageEnums";
import { useAuthStore } from "./store/useAuthStore";

const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.tsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
const UsersManagementPage = lazy(
  () => import("./pages/UsersManagementPage.tsx"),
);

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  guestOnly?: boolean;
}

const App = () => {
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  const routes: RouteConfig[] = [
    { path: PageList.DASHBOARD, element: <DashboardPage /> },
    { path: PageList.USERS_MANAGEMENT, element: <UsersManagementPage /> },
    { path: PageList.IP_MANAGEMENT, element: <LandingPage /> },
    { path: "/login", element: <LoginPage />, guestOnly: true },
    { path: "/signup", element: <SignUpPage />, guestOnly: true },
    { path: "/", element: <LandingPage />, guestOnly: true },
  ];

  return (
    <MuiThemeProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.guestOnly && isAuthenticated ? (
                  <Navigate to={PageList.DASHBOARD} replace />
                ) : (
                  route.element
                )
              }
            />
          ))}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? PageList.DASHBOARD : "/"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </MuiThemeProvider>
  );
};

export default App;
