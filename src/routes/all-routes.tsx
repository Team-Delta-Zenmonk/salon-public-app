import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/signup";
import AppLayout from "../layouts";
import Bookings from "../pages/bookings";
import BookingSuccess from "../pages/bookings/success";
import Profile from "../pages/profile";
import Favourites from "../pages/favourites";
import SalonDiscovery from "../pages/salon-discovery";
import SalonDetail from "../pages/salon-details";
import Cart from "../pages/cart";
import Checkout from "../pages/checkout";
import ProtectedRoute from "./protected-route";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<ProtectedRoute state={{ redirectTo: "/cart", resumeBooking: true }} />}>
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/salons" element={<SalonDiscovery />} />
        <Route path="/salons/:salonId" element={<SalonDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/success" element={<BookingSuccess />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AllRoutes;
