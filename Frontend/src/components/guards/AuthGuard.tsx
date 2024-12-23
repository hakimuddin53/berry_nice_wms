import React from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface AuthGuardType {
  children: React.ReactNode;
}

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }: AuthGuardType) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (!isInitialized) {
    return <></>;
  }

  if (!isAuthenticated) {
    if (pathname === "" || pathname === "/") {
      return <Navigate to="/auth/sign-in" />;
    }

    return (
      <Navigate
        to={
          "/auth/sign-in?redirect=" +
          pathname +
          "&searchQuery=" +
          encodeURIComponent(searchParams.toString()) +
          ""
        }
      />
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default AuthGuard;
