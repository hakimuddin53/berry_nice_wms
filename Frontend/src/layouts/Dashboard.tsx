import styled from "@emotion/styled";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box, CssBaseline, Hidden, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
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
    icon: <DashboardIcon />, // Replace with your actual icon component
    type: "single",
    children: [],
  },
  {
    id: 2,
    href: "/settings",
    itemType: "link",
    title: "Settings",
    icon: <SettingsIcon />, // Replace with your actual icon component
    type: "single",
    children: [],
  },
  {
    id: 3,
    href: "/reports",
    itemType: "link",
    title: "Reports",
    icon: <BarChartIcon />, // Replace with your actual icon component
    badge: "NEW",
    type: "single",
    children: [],
  },
];

export default Dashboard;
