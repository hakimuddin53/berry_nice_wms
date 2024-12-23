import styled from "@emotion/styled";
import React from "react";
import { NavLink } from "react-router-dom";

import { Box, ListItemButton, Drawer as MuiDrawer } from "@mui/material";

import { SidebarItemsType } from "../../types/sidebar";
import logo from "../../vendor/logo.png";
import Footer from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Brand = styled(ListItemButton)<{
  component?: React.ReactNode;
  to?: string;
}>`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 48px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 48px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled.img`
  margin-right: ${(props) => props.theme.spacing(2)};
  width: 32px;
  height: 32px;
`;

export type SidebarProps = {
  PaperProps: {
    style: {
      width: number;
    };
  };
  variant?: "permanent" | "persistent" | "temporary";
  open?: boolean;
  onClose?: () => void;
  items: SidebarItemsType[];
  showFooter?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
  items,
  showFooter = true,
  ...rest
}) => {
  return (
    <Drawer variant="permanent" {...rest}>
      <Brand component={NavLink as any} to="/">
        <BrandIcon src={logo} /> <Box ml={1}>platbricks</Box>
      </Brand>
      <img src="" alt="Customer logo" />
      <SidebarNav items={items} />
      {!!showFooter && <Footer />}
    </Drawer>
  );
};

export default Sidebar;
