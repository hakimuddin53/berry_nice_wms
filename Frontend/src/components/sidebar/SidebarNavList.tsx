import React from "react";
import { useLocation } from "react-router-dom";

import { SidebarItemsType } from "../../types/sidebar";
import reduceChildRoutes from "./reduceChildRoutes";

type SidebarNavListProps = {
  depth: number;
  pages: SidebarItemsType[];
  minimize: number;
};

const SidebarNavList: React.FC<SidebarNavListProps> = (props) => {
  const { pages, depth, minimize } = props;
  const router = useLocation();
  const currentRoute = router.pathname;

  const childRoutes = pages.reduce(
    (items, page) =>
      reduceChildRoutes({ items, page, currentRoute, depth, minimize }),
    [] as JSX.Element[]
  );

  return <React.Fragment>{childRoutes}</React.Fragment>;
};

export default SidebarNavList;
