import styled from "@emotion/styled";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Box, CssBaseline, Hidden, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import DashboardIcon from "@mui/icons-material/Dashboard";
import useAppTheme from "hooks/useTheme";
import { useSearchParams } from "react-router-dom";
import { SidebarItemsType } from "types/sidebar";
import Footer from "../components/Footer";
import GlobalStyle from "../components/GlobalStyle";
import Settings from "../components/Settings";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div<{ fixedLayout: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-width: 0;
  height: ${(props) => (props.fixedLayout ? "100vh" : "auto")};
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};
  overflow: auto;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

interface DashboardType {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardType> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [params] = useSearchParams();

  console.log("djhfjfd");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { fixedLayout } = useAppTheme();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  // const user = useAuth()?.user;
  // const menuId = user?.menuId;
  // const dashboardItems = useCompanyMenu(menuId);
  const focusMode = params.get("focusmode") === "true";

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {!focusMode && (
        <Drawer>
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <Sidebar
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              items={dashboardItems}
            />
          </Box>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Sidebar
              PaperProps={{ style: { width: drawerWidth } }}
              items={dashboardItems}
            />
          </Box>
        </Drawer>
      )}
      <AppContent fixedLayout={fixedLayout}>
        {!focusMode && <Navbar onDrawerToggle={handleDrawerToggle} />}
        <MainContent p={isLgUp ? 12 : 5}>
          {children}
          <Outlet />
        </MainContent>
        <Hidden smDown>
          <Footer />
        </Hidden>
      </AppContent>
      <Settings />
    </Root>
  );
};

export const dashboardItems: SidebarItemsType[] = [
  {
    id: 1,
    href: "/dashboard",
    itemType: "link",
    title: "Dashboard",
    icon: <DashboardIcon />,
    type: "single",
    children: [],
  },
  {
    id: 2,
    href: "/product",
    itemType: "link",
    title: "Product",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 3,
    href: "/stock-in",
    itemType: "link",
    title: "Stock In",
    icon: <AddShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 4,
    href: "/stock-out",
    itemType: "link",
    title: "Stock Out",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 5,
    href: "/stock-transfer",
    itemType: "link",
    title: "Stock Transfer",
    icon: <AddShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 6,
    href: "/stock-reservation",
    itemType: "link",
    title: "Stock Reservation",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 7,
    href: "/inventory",
    itemType: "link",
    title: "Inventory",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 8,
    href: "/category",
    itemType: "link",
    title: "Category",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 9,
    href: "/colour",
    itemType: "link",
    title: "Colour",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 10,
    href: "/design",
    itemType: "link",
    title: "Design",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 11,
    href: "/location",
    itemType: "link",
    title: "Rack",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 12,
    href: "/size",
    itemType: "link",
    title: "Size",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 13,
    href: "/stock-group",
    itemType: "link",
    title: "Stock Group",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
  {
    id: 14,
    href: "/warehouse",
    itemType: "link",
    title: "Warehouse",
    icon: <RemoveShoppingCartIcon />,
    type: "single",
    children: [],
  },
];

export default Dashboard;
