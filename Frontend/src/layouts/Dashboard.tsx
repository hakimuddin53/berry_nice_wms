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
  ArrowLeftRight,
  ArrowRight,
  BookOpenText,
  Box as BoxIcon,
  Database,
  LogIn,
  Palette,
  ReceiptText,
  RotateCcw,
  Ruler,
  Settings,
  ShoppingCart,
  Store,
  Users,
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

// 1) Build the lookup children once (keeps things DRY)
const lookupChildren: SidebarItemsType[] = [
  {
    id: 200,
    href: "/lookups/CustomerType",
    itemType: "link",
    title: "Customer Type",
    icon: <Users size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 201,
    href: "/lookups/SalesType",
    itemType: "link",
    title: "Sales Type",
    icon: <ArrowLeftRight size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 202,
    href: "/lookups/PaymentType",
    itemType: "link",
    title: "Payment Type",
    icon: <LogIn size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 203,
    href: "/lookups/Location",
    itemType: "link",
    title: "Location",
    icon: <ArchiveX size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 204,
    href: "/lookups/Region",
    itemType: "link",
    title: "Region",
    icon: <Store size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 205,
    href: "/lookups/NewOrUsed",
    itemType: "link",
    title: "New / Used",
    icon: <RotateCcw size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 206,
    href: "/lookups/InventoryStatus",
    itemType: "link",
    title: "Inventory Status",
    icon: <BoxIcon size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 207,
    href: "/lookups/ProductCategory",
    itemType: "link",
    title: "Product Category",
    icon: <Archive size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 208,
    href: "/lookups/ExpenseCategory",
    itemType: "link",
    title: "Expense Category",
    icon: <BookOpenText size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 210,
    href: "/lookups/ScreenSize",
    itemType: "link",
    title: "Screen Size",
    icon: <Ruler size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 211,
    href: "/lookups/Color",
    itemType: "link",
    title: "Color",
    icon: <Palette size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 212,
    href: "/lookups/Storage",
    itemType: "link",
    title: "Storage",
    icon: <BoxIcon size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 213,
    href: "/lookups/Ram",
    itemType: "link",
    title: "RAM",
    icon: <Ruler size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 214,
    href: "/lookups/Processor",
    itemType: "link",
    title: "Processor",
    icon: <Database size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 215,
    href: "/lookups/Brand",
    itemType: "link",
    title: "Brand",
    icon: <ShoppingCart size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
  {
    id: 216,
    href: "/lookups/Warehouse",
    itemType: "link",
    title: "Warehouse",
    icon: <Store size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.LOOKUP,
  },
];

// 2) Add a parent “Lookups” item that uses those as children
const lookupsParent: SidebarItemsType = {
  id: 199,
  href: "#", // important: parent should not navigate
  itemType: "link", // your renderer ignores this for parents
  title: "Master Data",
  icon: <Settings size={20} />, // pick any icon you like
  type: "multi", // optional; not used by renderer
  children: lookupChildren, // THIS enables collapse/expand
  requiredModule: ModuleEnum.LOOKUP, // hide if user lacks permission
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
    id: 4, // shift existing IDs down or renumber accordingly
    href: "/customer",
    itemType: "link",
    title: "Customer",
    icon: <Users size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.CUSTOMER, // make sure this exists
  },
  {
    id: 5,
    href: "/supplier",
    itemType: "link",
    title: "Supplier",
    icon: <Store size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.SUPPLIER, // make sure this exists
  },
  {
    id: 6,
    href: "/expense",
    itemType: "link",
    title: "Expenses",
    icon: <ReceiptText size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.EXPENSE, // make sure this exists
  },
  {
    id: 8,
    href: "/stock-in",
    itemType: "link",
    title: "Stock Recieve",
    icon: <ArrowRight size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.STOCKIN, // <--- Link to STOCKIN module
  },
  {
    id: 9,
    href: "/invoice",
    itemType: "link",
    title: "Invoice",
    icon: <ReceiptText size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.INVOICE,
  },

  {
    id: 11,
    href: "/inventory",
    itemType: "link",
    title: "Inventory",
    icon: <BoxIcon size={20} />,
    type: "single",
    children: [],
    requiredModule: ModuleEnum.INVENTORY,
  },
  lookupsParent,
];

const navItems = [
  {
    title: "Pages",
    pages: dashboardItems,
  },
];

export default Dashboard;
