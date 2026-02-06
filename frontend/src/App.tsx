import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MuiThemeProvider } from "./theme/MuiThemeProvider";
import { LoadingFallback } from "./components/LoadingFallback";
import { PageList } from "./enums/pageEnums";
import { useAuthStore } from "./store/useAuthStore";
import {
  CAN_VIEW_DASHBOARD,
  CAN_VIEW_IP_MANAGEMENT,
  CAN_VIEW_USERS,
} from "./enums/permissionEnums";

const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.tsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
const IpManagementPage = lazy(() => import("./pages/IpManagementPage.tsx"));
const UsersManagementPage = lazy(
  () => import("./pages/UsersManagementPage.tsx"),
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  requiredPermission?: string;
}

const App = () => {
  const { isAuthenticated, initialize, hasPermission, isLoading } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  const routes: RouteConfig[] = [
    {
      path: PageList.DASHBOARD,
      element: <DashboardPage />,
      requiredPermission: CAN_VIEW_DASHBOARD,
    },
    {
      path: PageList.USERS_MANAGEMENT,
      element: <UsersManagementPage />,
      requiredPermission: CAN_VIEW_USERS,
    },
    {
      path: PageList.IP_MANAGEMENT,
      element: <IpManagementPage />,
      requiredPermission: CAN_VIEW_IP_MANAGEMENT,
    },
    { path: "/", element: <LandingPage /> },
    {
      path: "/unauthorized",
      element: (
        <NotFoundPage
          title="Unauthorized Access"
          message="You don't have the necessary permissions to access this page."
        />
      ),
    },
  ];

  const guestRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
  ];

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <MuiThemeProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "12px",
          },
        }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {guestRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={isAuthenticated ? <Navigate to="/" /> : route.element}
            />
          ))}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.requiredPermission &&
                !hasPermission(route.requiredPermission) ? (
                  <Navigate to="/unauthorized" replace />
                ) : (
                  route.element
                )
              }
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MuiThemeProvider>
  );
};

export default App;
