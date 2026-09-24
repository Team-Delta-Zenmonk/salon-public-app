import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "../pages/signup";
import AppLayout from "../layouts";
import HomePage from "../pages/home";
import ServicesPage from "../pages/services";
import SpecialistsPage from "../pages/specialists";
import AboutPage from "../pages/about";
import Bookings from "../pages/bookings";
import BookingSuccess from "../pages/bookings/success";
import Profile from "../pages/profile";
import Cart from "../pages/cart";
import Checkout from "../pages/checkout";
import ProtectedRoute from "./protected-route";
import UnProtectedRoute from "./unprotected-route";
import { StorefrontProvider } from "../providers/storefront-provider";
import NotFoundPage from "../pages/not-found";

function AllRoutes() {
  return (
    <StorefrontProvider>
      <Routes>
        <Route element={<UnProtectedRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/salons/:salonSlug/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoute state={{ redirectTo: "/cart", resumeBooking: true }} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/salons/:salonSlug/checkout" element={<Checkout />} />
        </Route>

        <Route element={<AppLayout />}>
          {/* Root query-based / subdomain routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/specialists" element={<SpecialistsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<Cart />} />

          {/* Path-based slug routes */}
          <Route path="/salons/:salonSlug" element={<HomePage />} />
          <Route path="/salons/:salonSlug/services" element={<ServicesPage />} />
          <Route path="/salons/:salonSlug/specialists" element={<SpecialistsPage />} />
          <Route path="/salons/:salonSlug/about" element={<AboutPage />} />
          <Route path="/salons/:salonSlug/cart" element={<Cart />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/success" element={<BookingSuccess />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/salons/:salonSlug/bookings" element={<Bookings />} />
            <Route path="/salons/:salonSlug/bookings/success" element={<BookingSuccess />} />
            <Route path="/salons/:salonSlug/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </StorefrontProvider>
  );
}

export default AllRoutes;
