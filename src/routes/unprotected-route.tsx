import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hook";

interface UnProtectedRouteProps {
    redirectPath?: string;
    state?: any;
}

const UnProtectedRoute = ({ redirectPath = "/salons", state }: UnProtectedRouteProps) => {
    const { isAuthenticated } = useAppSelector((s) => s.auth);
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to={redirectPath} state={state || { from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default UnProtectedRoute;
