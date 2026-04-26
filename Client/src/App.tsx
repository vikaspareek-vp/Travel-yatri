import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import useAppContext from "./hooks/useAppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import ApiDocs from "./pages/ApiDocs";
import ApiStatus from "./pages/ApiStatus";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AuthCallback from "./pages/AuthCallback";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminHotels from "./pages/AdminHotels";
import AdminBookings from "./pages/AdminBookings";

const App = () => {
  const { isLoggedIn, user } = useAppContext();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* SEARCH */}
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        {/* DETAIL */}
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />

        {/* API DOCS */}
        <Route
          path="/api-docs"
          element={
            <Layout>
              <ApiDocs />
            </Layout>
          }
        />

        {/* API STATUS */}
        <Route
          path="/api-status"
          element={
            <Layout>
              <ApiStatus />
            </Layout>
          }
        />

        {/* BUSINESS INSIGHTS */}
        <Route
          path="/business-insights"
          element={
            <Layout>
              <AnalyticsDashboard />
            </Layout>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* SIGN IN */}
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />

        {/* AUTH CALLBACK */}
        <Route
          path="/auth/callback"
          element={
            <Layout>
              <AuthCallback />
            </Layout>
          }
        />

        {/* MY HOTELS */}
        <Route
          path="/my-hotels"
          element={
            <Layout>
              <MyHotels />
            </Layout>
          }
        />

        {/* MY BOOKINGS */}
        <Route
          path="/my-bookings"
          element={
            <Layout>
              <MyBookings />
            </Layout>
          }
        />

        {/* LOGGED IN ROUTES */}
        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />

            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />

            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
          </>
        )}

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          element={
            <AdminRoute
              isLoggedIn={isLoggedIn}
              role={user?.role || ""}
            />
          }
        >
          <Route
            path="/admin/dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />

          <Route
            path="/admin/users"
            element={
              <Layout>
                <AdminUsers />
              </Layout>
            }
          />

          <Route
            path="/admin/hotels"
            element={
              <Layout>
                <AdminHotels />
              </Layout>
            }
          />
          <Route
  path="/admin/bookings"
  element={
    <Layout>
      <AdminBookings />
    </Layout>
  }
/>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </Router>
  );
};

export default App;