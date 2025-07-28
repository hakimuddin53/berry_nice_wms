import styled from "@emotion/styled";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Box, CssBaseline, Hidden, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import {
  Archive,
  ArchiveX,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BookOpenText,
  Box as BoxIcon,
  Database,
  LogIn,
  Palette,
  PersonStanding,
  RotateCcw,
  Ruler,
  Settings,
  ShoppingCart,
  SquareScissors,
  Store,
  Users,
  Warehouse,
} from "lucide-react";

import useAppTheme from "hooks/useTheme";
import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import { useSearchParams } from "react-router-dom";
import { SidebarItemsType } from "types/sidebar";
import Footer from "../components/Footer";
import GlobalStyle from "../components/GlobalStyle";
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
      {/* <Settings /> */}
    </Root>
  );
};

export const dashboardItems: SidebarItemsType[] = [
  {
    id: 1,
    href: "/dashboard",
    itemType: "link",
    title: "Dashboard",
    icon: <Database size={20} />,
    type: "single",
    children: [],
    // No requiredModule needed for Dashboard typically
  },
  {
    id: 2,
    href: "/user",
    itemType: "link",
    title: "User",
    icon: <Users size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.USER, // <--- Link to USER module
  },
  {
    id: 3,
    href: "/user-role",
    itemType: "link",
    title: "User Role",
    icon: <Settings size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.USERROLE, // <--- Link to USERROLE module
  },
  {
    id: 4,
    href: "/product",
    itemType: "link",
    title: "Product",
    icon: <ShoppingCart size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.PRODUCT, // <--- Link to PRODUCT module
  },
  {
    id: 5,
    href: "/stock-in",
    itemType: "link",
    title: "Stock In",
    icon: <ArrowRight size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKIN, // <--- Link to STOCKIN module
  },
  {
    id: 6,
    href: "/stock-out",
    itemType: "link",
    title: "Stock Out",
    icon: <ArrowLeft size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKOUT, // <--- Link to STOCKOUT module
  },
  {
    id: 7,
    href: "/stock-transfer",
    itemType: "link",
    title: "Stock Transfer",
    icon: <ArrowLeftRight size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKTRANSFER, // <--- Link to STOCKTRANSFER module
  },
  {
    id: 8,
    href: "/stock-reservation",
    itemType: "link",
    title: "Stock Reservation",
    icon: <LogIn size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKRESERVATION, // <--- Link to STOCKRESERVATION module
  },
  {
    id: 9,
    href: "/stock-adjustment",
    itemType: "link",
    title: "Stock Adjustment",
    icon: <RotateCcw size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKADJUSTMENT, // <--- Link to STOCKADJUSTMENT module
  },
  {
    id: 10,
    href: "/inventory",
    itemType: "link",
    title: "Inventory",
    icon: <BoxIcon size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.INVENTORY,
  },
  {
    id: 11,
    href: "/inventory-summary",
    itemType: "link",
    title: "Inventory Summary",
    icon: <Store size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.INVENTORY,
  },
  {
    id: 11,
    href: "/inventory-summary-product",
    itemType: "link",
    title: "Inventory Summary Product",
    icon: <BookOpenText size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.INVENTORY,
  },
  {
    id: 12,
    href: "/category",
    itemType: "link",
    title: "Category",
    icon: <Archive size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.CATEGORY,
  },
  {
    id: 13,
    href: "/colour",
    itemType: "link",
    title: "Colour",
    icon: <Palette size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.COLOUR,
  },
  {
    id: 14,
    href: "/design",
    itemType: "link",
    title: "Design",
    icon: <SquareScissors size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.DESIGN,
  },
  {
    id: 15,
    href: "/location",
    itemType: "link",
    title: "Rack",
    icon: <ArchiveX size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOCATION,
  },
  {
    id: 16,
    href: "/size",
    itemType: "link",
    title: "Size",
    icon: <Ruler size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.SIZE,
  },
  {
    id: 17,
    href: "/stock-group",
    itemType: "link",
    title: "Stock Group",
    icon: <BoxIcon size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKGROUP,
  },
  {
    id: 18,
    href: "/warehouse",
    itemType: "link",
    title: "Warehouse",
    icon: <Warehouse size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.WAREHOUSE,
  },
  {
    id: 19,
    href: "/client-code",
    itemType: "link",
    title: "Client Code",
    icon: <PersonStanding size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.CLIENTCODE,
  },
];

const navItems = [
  {
    title: "Pages",
    pages: dashboardItems,
  },
];

export default Dashboard;
