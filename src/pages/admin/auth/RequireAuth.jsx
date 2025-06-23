import { useLocation, Navigate } from "react-router-dom";

import { useAuth } from "./auth";

export const RequireAuth = ({ children }) => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  let auth = useAuth();
  const now = Date.now(); // Unix timestamp in milliseconds

  if (user !== null && now < loginInfo.expires_at) {
    auth.signedin = true;
    auth.user = loginInfo.name;
    auth.token = loginInfo.token;
    auth.permissions = permissions;
  }
  let location = useLocation();

  if (!auth.signedin) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
