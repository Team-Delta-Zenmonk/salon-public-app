import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/signup";
import AppLayout from "../layouts";
import Bookings from "../pages/bookings";
import Profile from "../pages/profile";
import Favourites from "../pages/favourites";
import SalonDiscovery from "../pages/salon-discovery";
import SalonDetail from "../pages/salon-discovery/_components/salon-details";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<AppLayout />}>
        <Route path="/salons" element={<SalonDiscovery />} />
        <Route path="/salons/:salonId" element={<SalonDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AllRoutes;
