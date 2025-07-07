// All pages that rely on 3rd party components (other than Material-UI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// Auth components
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";
import ResetPassword from "./pages/auth/ResetPassword";
import SignIn from "./pages/auth/SignIn";

// Protected routes
import UnauthorizedPage from "components/auth/UnauthorizedPage";
import GuestGuard from "components/guards/GuestGuard";
import ModuleGuard from "components/guards/ModuleGuard";
import { HomePageNavigator } from "components/platbricks/shared/HomePageNavigator";
import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import CartonSizeCreateEditPage from "pages/cartonSize/createEdit/CartonSizeCreateEditPage";
import CartonSizeDetailsPage from "pages/cartonSize/details/CartonSizeDetailsPage";
import CartonSizeListPage from "pages/cartonSize/index/CartonSizeListPage";
import CategoryCreateEditPage from "pages/category/createEdit/CategoryCreateEditPage";
import CategoryDetailsPage from "pages/category/details/CategoryDetailsPage";
import CategoryListPage from "pages/category/index/CategoryListPage";
import ClientCodeCreateEditPage from "pages/clientCode/createEdit/ClientCodeCreateEditPage";
import ClientCodeDetailsPage from "pages/clientCode/details/ClientCodeDetailsPage";
import ClientCodeListPage from "pages/clientCode/index/ClientCodeListPage";
import ColourCreateEditPage from "pages/colour/createEdit/ColourCreateEditPage";
import ColourDetailsPage from "pages/colour/details/ColourDetailsPage";
import ColourListPage from "pages/colour/index/ColourListPage";
import DashboardPage from "pages/dashboard/DashboardPage";
import DesignCreateEditPage from "pages/design/createEdit/DesignCreateEditPage";
import DesignDetailsPage from "pages/design/details/DesignDetailsPage";
import DesignListPage from "pages/design/index/DesignListPage";
import InventoryListPage from "pages/inventory/InventoryListPage";
import InventorySummaryListPage from "pages/inventorySummary/InventorySummaryListPage";
import LocationCreateEditPage from "pages/location/createEdit/LocationCreateEditPage";
import LocationDetailsPage from "pages/location/details/LocationDetailsPage";
import LocationListPage from "pages/location/index/LocationListPage";
import ProductBulkUploadPage from "pages/products/bulkUpload/ProductBulkUploadPage";
import ProductCreateEditPage from "pages/products/createEdit/ProductCreateEditPage";
import ProductDetailsPage from "pages/products/details/ProductDetailsPage";
import ProductListPage from "pages/products/index/ProductListPage";
import SizeCreateEditPage from "pages/size/createEdit/SizeCreateEditPage";
import SizeDetailsPage from "pages/size/details/SizeDetailsPage";
import SizeListPage from "pages/size/index/SizeListPage";
import StockAdjustmentCreateEditPage from "pages/stockAdjustment/createEdit/StockAdjustmentCreateEditPage";
import StockAdjustmentDetailsPage from "pages/stockAdjustment/details/StockAdjustmentDetailsPage";
import StockAdjustmentListPage from "pages/stockAdjustment/index/StockAdjustmentListPage";
import StockInCreateEditPage from "pages/stockIn/createEdit/StockInCreateEditPage";
import StockInDetailsPage from "pages/stockIn/details/StockInDetailsPage";
import StockInListPage from "pages/stockIn/index/StockInListPage";
import StockInPrintPage from "pages/stockIn/print/StockInPrintPage";
import StockOutCreateEditPage from "pages/stockOut/createEdit/StockOutCreateEditPage";
import StockOutDetailsPage from "pages/stockOut/details/StockOutDetailsPage";
import StockOutListPage from "pages/stockOut/index/StockOutListPage";
import StockReservationCreateEditPage from "pages/stockReservation/createEdit/StockReservationCreateEditPage";
import StockReservationDetailsPage from "pages/stockReservation/details/StockReservationDetailsPage";
import StockReservationListPage from "pages/stockReservation/index/StockReservationListPage";
import StockTransferCreateEditPage from "pages/stockTransfer/createEdit/StockTransferCreateEditPage";
import StockTransferDetailsPage from "pages/stockTransfer/details/StockTransferDetailsPage";
import StockTransferListPage from "pages/stockTransfer/index/StockTransferListPage";
import UserCreateEditPage from "pages/user/createEdit/UserCreateEditPage";
import UserDetailsPage from "pages/user/details/UserDetailsPage";
import UserListPage from "pages/user/index/UserListPage";
import UserRoleCreateEditPage from "pages/userRoles/createEdit/UserRoleCreateEditPage";
import UserRoleDetailsPage from "pages/userRoles/details/UserRoleDetailsPage";
import UserRoleListPage from "pages/userRoles/index/UserRoleListPage";
import WarehouseCreateEditPage from "pages/warehouse/createEdit/WarehouseCreateEditPage";
import WarehouseDetailsPage from "pages/warehouse/details/WarehouseDetailsPage";
import WarehouseListPage from "pages/warehouse/index/WarehouseListPage";
import { Navigate } from "react-router-dom";

// --- Routes Definition ---
const routes = [
  // --- Authenticated Routes ---
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout /> {/* 2. Render main layout */}
      </AuthGuard>
    ),
    // Children are rendered inside DashboardLayout's <Outlet />
    // ModuleGuard is applied to each specific child element
    children: [
      {
        index: true, // Matches "/" path inside the layout
        element: <HomePageNavigator />, // No specific module needed? Or apply one if required.
      },
      {
        path: "dashboard",
        element: <DashboardPage />, // Assuming dashboard needs no specific module beyond login
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USER}>
                <UserListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USER}>
                <UserCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USER}>
                <UserDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USER}>
                <UserCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "user-role",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USERROLE}>
                <UserRoleListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USERROLE}>
                <UserRoleCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USERROLE}>
                <UserRoleDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.USERROLE}>
                <UserRoleCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-in",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKIN}>
                <StockInListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKIN}>
                <StockInCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKIN}>
                <StockInDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKIN}>
                <StockInCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/print",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKIN}>
                <StockInPrintPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-out",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKOUT}>
                <StockOutListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKOUT}>
                <StockOutCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKOUT}>
                <StockOutDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKOUT}>
                <StockOutCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-adjustment",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKADJUSTMENT}>
                <StockAdjustmentListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKADJUSTMENT}>
                <StockAdjustmentCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKADJUSTMENT}>
                <StockAdjustmentDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKADJUSTMENT}>
                <StockAdjustmentCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-transfer",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKTRANSFER}>
                <StockTransferListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKTRANSFER}>
                <StockTransferCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKTRANSFER}>
                <StockTransferDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKTRANSFER}>
                <StockTransferCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-reservation",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKRESERVATION}>
                <StockReservationListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKRESERVATION}>
                <StockReservationCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKRESERVATION}>
                <StockReservationDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKRESERVATION}>
                <StockReservationCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "category",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CATEGORY}>
                <CategoryListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CATEGORY}>
                <CategoryCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CATEGORY}>
                <CategoryDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CATEGORY}>
                <CategoryCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "colour",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.COLOUR}>
                <ColourListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.COLOUR}>
                <ColourCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.COLOUR}>
                <ColourDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.COLOUR}>
                <ColourCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "design",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.DESIGN}>
                <DesignListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.DESIGN}>
                <DesignCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.DESIGN}>
                <DesignDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.DESIGN}>
                <DesignCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "location",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOCATION}>
                <LocationListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOCATION}>
                <LocationCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOCATION}>
                <LocationDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOCATION}>
                <LocationCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "product",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.PRODUCT}>
                <ProductListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.PRODUCT}>
                <ProductCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.PRODUCT}>
                <ProductDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.PRODUCT}>
                <ProductCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: "bulk-upload",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.PRODUCT}>
                <ProductBulkUploadPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.INVENTORY}>
                <InventoryListPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "inventory-summary",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.INVENTORY}>
                <InventorySummaryListPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "size",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SIZE}>
                <SizeListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SIZE}>
                <SizeCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SIZE}>
                <SizeDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SIZE}>
                <SizeCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "stock-group", // Note: Maps to CartonSize components
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKGROUP}>
                <CartonSizeListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKGROUP}>
                <CartonSizeCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKGROUP}>
                <CartonSizeDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.STOCKGROUP}>
                <CartonSizeCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "warehouse",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.WAREHOUSE}>
                <WarehouseListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.WAREHOUSE}>
                <WarehouseCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.WAREHOUSE}>
                <WarehouseDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.WAREHOUSE}>
                <WarehouseCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "client-code",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CLIENTCODE}>
                <ClientCodeListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CLIENTCODE}>
                <ClientCodeCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CLIENTCODE}>
                <ClientCodeDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CLIENTCODE}>
                <ClientCodeCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
    ],
  },

  // --- Authentication Routes (for Guests) ---
  {
    path: "auth",
    element: (
      <GuestGuard>
        {/* Prevents logged-in users from seeing these */}
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      /*  
      {
        path: "sign-up",
        element: <SignUp />, // Assuming SignUp component exists if uncommented
      },
      */
    ],
  },

  // --- Utility Routes ---
  {
    path: "unauthorized", // Page shown by ModuleGuard redirect
    element: <UnauthorizedPage />,
  },
  {
    path: "404",
    element: <Page404 />,
  },
  {
    path: "500",
    element: <Page500 />,
  },

  // --- Catch-all Route ---
  // Redirects any unmatched path to the 404 page
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
