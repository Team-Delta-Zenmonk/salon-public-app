import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import { buildStorefrontUrl } from "../common/storefront-slug.utils";

interface ProtectedRouteProps {
  redirectPath?: string;
  state?: any;
}

const ProtectedRoute = ({ redirectPath = "/signup", state }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={buildStorefrontUrl(redirectPath)} state={state || { from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
