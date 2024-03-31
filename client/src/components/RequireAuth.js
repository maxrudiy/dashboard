import { useLocation, Navigate, Outlet } from "react-router-dom";
import { UseSelector, useSelector } from "react-redux";
import { selectCurrentAccessToken } from "../store/auth-slice";

const RequireAuth = () => {
  const accessToken = useSelector(selectCurrentAccessToken);
  const location = useLocation();
  return accessToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
export default RequireAuth;
