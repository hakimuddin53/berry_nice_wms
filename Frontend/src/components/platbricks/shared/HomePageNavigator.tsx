import useAuth from "hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { useCatalogMenuItemService } from "services/CatalogMenuItemService";
import { useUserService } from "services/UserService";

export const HOMEPAGE_DEFAULT: string = "/pages";

const HomePageNavigator = () => {
  const catalogmenuItemService = useCatalogMenuItemService();
  const userService = useUserService();
  const navigate = useNavigate();
  const { user } = useAuth();

  return <Navigate to={HOMEPAGE_DEFAULT} />;
};

export { HomePageNavigator };
