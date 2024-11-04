import useAuth from "hooks/useAuth";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCatalogMenuItemService } from "services/CatalogMenuItemService";
import { useUserService } from "services/UserService";
import { guid } from "types/guid";

export const HOMEPAGE_DEFAULT: string = "/dashboard";

const HomePageNavigator = () => {
  const catalogmenuItemService = useCatalogMenuItemService();
  const userService = useUserService();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    userService.getByParameters([user?.id], 1, 1).then((res) => {
      const updatedUser = res.data.at(0);
      const reactHomeMenuItemId = updatedUser?.reactHomeMenuItemId;
      const reactHomeMenuItemLocationId =
        updatedUser?.reactHomeMenuItemLocationId;

      if (reactHomeMenuItemId) {
        catalogmenuItemService
          .getCatalogMenuItemById(reactHomeMenuItemId as guid)
          .then((res) => {
            const url = `/${res.url?.replaceAll(
              ":locationId",
              reactHomeMenuItemLocationId || ""
            )}`;

            navigate(url);
          });
      }
    });
  }, [userService, catalogmenuItemService, navigate, user?.id]);

  return <Navigate to={HOMEPAGE_DEFAULT} />;
};

export { HomePageNavigator };
