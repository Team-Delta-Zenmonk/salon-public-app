import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/signup";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default AllRoutes;
