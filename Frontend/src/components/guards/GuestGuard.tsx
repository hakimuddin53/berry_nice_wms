import * as React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface GuestGuardType {
  children: React.ReactNode;
}

// For routes that can only be accessed by unauthenticated users
function GuestGuard({ children }: GuestGuardType) {
  const { isAuthenticated, isInitialized } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUri =
    (searchParams.get("redirect") || "") +
    "?" +
    decodeURIComponent(searchParams.get("searchQuery") || "");
  if (!isInitialized) {
    return <></>;
  }

  if (isAuthenticated) {
    if (redirectUri === "" || redirectUri === "?") {
      return <Navigate to="/" />;
    }
    return <Navigate to={redirectUri} />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default GuestGuard;
