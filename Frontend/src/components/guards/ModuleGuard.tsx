// src/components/guards/ModuleGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom";

import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import jwtDecode from "jwt-decode";
import useAuth from "../../hooks/useAuth";

interface ModuleGuardProps {
  children: React.ReactNode;
  requiredModule: ModuleEnum; // Use the Enum type for better safety
}

// For routes that require specific module permissions for authenticated users
function ModuleGuard({ children, requiredModule }: ModuleGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <React.Fragment />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const accessToken = window.localStorage.getItem("accessToken");

  const decoded = accessToken ? jwtDecode(accessToken) : (null as any);

  var userEmail = decoded?.sub ?? "";

  const userModulesString = decoded?.Modules ?? "";

  const allowedModules = userModulesString
    .split(",")
    .map((module: string) => module.trim().toUpperCase())
    .filter((module: any) => module); // Remove empty strings if any

  const isAdmin = userEmail.toLowerCase() === "admin@mhglobal.com";

  const hasPermission =
    isAdmin || allowedModules.includes(requiredModule.toUpperCase());

  if (!hasPermission) {
    console.warn(
      `ModuleGuard: User ${
        decoded?.sub ?? "UNKNOWN"
      } missing required module [${requiredModule}]. Allowed: [${userModulesString}]`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default ModuleGuard;
