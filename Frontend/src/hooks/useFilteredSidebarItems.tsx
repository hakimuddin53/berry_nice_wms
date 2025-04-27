// Assuming this hook is in a utility file (e.g., hooks/useFilteredSidebarItems.ts)

import jwtDecode from "jwt-decode"; // Import jwtDecode
import { SidebarItemsType } from "types/sidebar";
import useAuth from "./useAuth";

export const useFilteredSidebarItems = (
  allMenuItems: SidebarItemsType[]
): SidebarItemsType[] => {
  const { isAuthenticated, isInitialized } = useAuth(); // Use isAuthenticated to ensure user is logged in

  // If auth is not initialized or user is not authenticated, show no items
  if (!isInitialized || !isAuthenticated) {
    return [];
  }

  // Get allowed modules similar to ModuleGuard
  const accessToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null;
  // Add proper error handling for jwtDecode in a real app if needed
  const decoded = accessToken ? jwtDecode(accessToken) : (null as any);

  const userModulesString = decoded?.Modules ?? "";
  const allowedModules = userModulesString
    .split(",")
    .map((module: string) => module.trim().toUpperCase())
    .filter((module: any) => module); // Filter out empty strings

  // Filter the items based on required modules
  const filteredItems = allMenuItems.filter((item) => {
    // If an item doesn't require a module, always include it
    // OR if it requires a module AND the user's allowed modules include it (case-insensitive check)
    return (
      !item.requiredModule ||
      allowedModules.includes(item.requiredModule.toUpperCase())
    );
  });

  // Note: This simple filter works for single-level items.
  // If you have nested items with `children`, you'd need a recursive filter
  // function here to filter children as well.

  return filteredItems;
};
