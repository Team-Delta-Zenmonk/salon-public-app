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
        <Route path="/discovery" element={<SalonDiscovery />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/salon/:uuid" element={<SalonDetail />} />
      </Route>
    </Routes>
  );
}

export default AllRoutes;
