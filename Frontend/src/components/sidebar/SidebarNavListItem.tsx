import styled from "@emotion/styled";
import { darken, rgba } from "polished";
import React, { forwardRef, useEffect } from "react";
import {
  NavLink,
  NavLinkProps,
  matchPath,
  useLocation,
} from "react-router-dom";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Chip,
  Collapse,
  ListItemButton,
  ListItemProps,
  ListItemText,
} from "@mui/material";
import { SidebarItemsType } from "types/sidebar";

const CustomRouterLink = forwardRef<any, NavLinkProps>((props, ref) => (
  <div ref={ref}>
    <NavLink {...props} />
  </div>
));

type ItemType = {
  activeclassname?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  to?: string;
  component?: typeof NavLink;
  depth: number;
  disablelink?: boolean;
};

const Item = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "disablelink", //this prevent utility prop from being forwarded to html, creating warning
})<ItemType>`
  padding-top: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-bottom: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-left: ${(props) =>
    props.theme.spacing(
      props.depth && props.depth > 0 ? 4 + props.depth * 4 : 4
    )};
  padding-right: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 4 : 7)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: ${(props) => props.theme.sidebar.color};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      darken(0.03, props.theme.sidebar.background)};
    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
  cursor: ${(props) => (props.disablelink ?? false ? "default" : "pointer")};
`;

type TitleType = {
  depth: number;
};

const Title = styled(ListItemText)<TitleType>`
  margin: 0;
  span {
    color: ${(props) =>
      rgba(
        props.theme.sidebar.color,
        props.depth && props.depth > 0 ? 0.7 : 1
      )};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

const Badge = styled(Chip)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 26px;
  top: 12px;
  background: ${(props) => props.theme.sidebar.badge.background};
  z-index: 1;
  span.MuiChip-label,
  span.MuiChip-label:hover {
    font-size: 11px;
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const ExpandLessIcon = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const ExpandMoreIcon = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

type SidebarNavListItemProps = ListItemProps & {
  className?: string;
  depth: number;
  href: string;
  //icon: React.ReactNode;
  icon: any;
  badge?: string;
  open?: boolean;
  title: string;
  currentRoute: string;
  childrenData?: SidebarItemsType[];
  minimize: number;
};

const SidebarNavListItem: React.FC<SidebarNavListItemProps> = (props) => {
  const {
    title,
    href,
    depth = 0,
    children,
    badge,
    open: openProp = false,
    currentRoute,
    childrenData,
    minimize,
  } = props;

  const [open, setOpen] = React.useState(openProp);

  const handleToggle = () => {
    setOpen((state) => !state);
  };

  const navItemUrlMatchCurrentRoute = () => {
    return currentRoute === "/" + href;
  };

  const hasChildPath = (
    childrenData: SidebarItemsType[],
    href: string,
    currentRoute: string
  ): boolean => {
    if (href !== "#") {
      return !!matchPath(
        {
          path: href,
          end: false,
        },
        currentRoute
      );
    }
    return (
      childrenData &&
      childrenData.some((x) => hasChildPath(x.children, x.href, currentRoute))
    );
  };

  let location = useLocation();
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (childrenData) {
      let reopen = hasChildPath(childrenData, href, currentRoute);
      if (reopen) {
        setOpen(reopen);
      }
    }
  }, [location]);
  /* eslint-enable */

  useEffect(() => {
    if (minimize > 0) {
      setOpen(false);
    }
  }, [minimize]);

  if (children) {
    return (
      <React.Fragment>
        <Item depth={depth} onClick={handleToggle}>
          {/* {Icon} */}
          <Title depth={depth}>
            {title}
            {badge && <Badge label={badge} />}
          </Title>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Item>
        <Collapse in={open}>{children}</Collapse>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Item
        depth={depth}
        component={CustomRouterLink}
        to={href}
        activeclassname="active"
        onClick={(e) => {
          if (navItemUrlMatchCurrentRoute()) {
            e.preventDefault();
          }
        }}
        disablelink={navItemUrlMatchCurrentRoute()}
      >
        {/* {Icon} */}
        <Title depth={depth}>
          {title}
          {badge && <Badge label={badge} />}
        </Title>
      </Item>
    </React.Fragment>
  );
};

export default SidebarNavListItem;
