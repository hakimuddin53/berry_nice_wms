import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface GuestGuardType {
  children: React.ReactNode;
}

// For routes that can only be accessed by unauthenticated users
function GuestGuard({ children }: GuestGuardType) {
  const { isAuthenticated, isInitialized } = useAuth();
  const [searchParams] = useSearchParams();
  const { tokenLogin } = useAuth();

  if (!isInitialized) {
    return <></>;
  }

  if (isAuthenticated) {
    const redirectUri =
      (searchParams.get("redirect") || "") +
      "?" +
      decodeURIComponent(searchParams.get("searchQuery") || "");

    if (redirectUri === "" || redirectUri === "?") {
      return <Navigate to="/" />;
    }
    return <Navigate to={redirectUri} />;
  }

  var loginToken = searchParams.get("logintoken");
  var loginEmail = searchParams.get("loginemail");
  if (loginToken && loginEmail) {
    tokenLogin(loginToken, loginEmail);
    return <></>;
  }

  var autoLogin = searchParams.get("autologin");
  if (autoLogin === "true") {
    const autoLoginUrl =
      process.env.REACT_APP_MVC_APP_URL +
      "?page=" +
      encodeURIComponent(
        window.location.pathname + window.location.search + window.location.hash
      );
    window.location.href = autoLoginUrl;
    return <></>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default GuestGuard;
