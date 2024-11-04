import { matchPath } from "react-router-dom";

import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { SidebarItemsType } from "../../types/sidebar";
import SidebarNavList from "./SidebarNavList";
import SidebarNavListItem from "./SidebarNavListItem";

type ReduceChildRoutesProps = {
  depth: number;
  page: SidebarItemsType;
  items: JSX.Element[];
  currentRoute: string;
  minimize: number;
};

const Title = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  font-size: ${(props) => props.theme.typography.caption.fontSize};
  padding: ${(props) => props.theme.spacing(4)}
    ${(props) => props.theme.spacing(7)} ${(props) => props.theme.spacing(1)};
  opacity: 0.4;
  text-transform: uppercase;
  display: block;
`;

const hasChildPath = (
  page: SidebarItemsType,
  currentRoute: string
): boolean => {
  if (page.href !== "#") {
    return !!matchPath(
      {
        path: page.href,
        end: false,
      },
      currentRoute
    );
  }
  return page.children.some((x) => hasChildPath(x, currentRoute));
};

const reduceChildRoutes = (props: ReduceChildRoutesProps) => {
  const { items, page, depth, currentRoute, minimize } = props;

  if (page.type === "Separator") {
    items.push(
      <Title variant="subtitle2" key={page.title}>
        {page.title}
      </Title>
    );
  } else if (page.children && page.children.length > 0) {
    var open = hasChildPath(page, currentRoute);
    items.push(
      <SidebarNavListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        open={!!open}
        title={page.title}
        href={page.href}
        currentRoute={currentRoute}
        childrenData={page.children}
        minimize={minimize}
      >
        <SidebarNavList
          depth={depth + 1}
          pages={page.children}
          minimize={minimize}
        />
      </SidebarNavListItem>
    );
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        title={page.title}
        currentRoute={currentRoute}
        minimize={minimize}
      ></SidebarNavListItem>
    );
  }

  return items;
};

export default reduceChildRoutes;
