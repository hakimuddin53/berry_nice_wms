import { Navigate } from "react-router-dom";

export const HOMEPAGE_DEFAULT: string = "/dashboard";

const HomePageNavigator = () => {
  return <Navigate to={HOMEPAGE_DEFAULT} />;
};

export { HomePageNavigator };
