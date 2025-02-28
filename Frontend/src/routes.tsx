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
import GuestGuard from "components/guards/GuestGuard";
import { HomePageNavigator } from "components/platbricks/shared/HomePageNavigator";
import CartonSizeCreateEditPage from "pages/cartonSize/createEdit/CartonSizeCreateEditPage";
import CartonSizeDetailsPage from "pages/cartonSize/details/CartonSizeDetailsPage";
import CartonSizeListPage from "pages/cartonSize/index/CartonSizeListPage";
import CategoryCreateEditPage from "pages/category/createEdit/CategoryCreateEditPage";
import CategoryDetailsPage from "pages/category/details/CategoryDetailsPage";
import CategoryListPage from "pages/category/index/CategoryListPage";
import ColourCreateEditPage from "pages/colour/createEdit/ColourCreateEditPage";
import ColourDetailsPage from "pages/colour/details/ColourDetailsPage";
import ColourListPage from "pages/colour/index/ColourListPage";
import DashboardPage from "pages/dashboard/DashboardPage";
import DesignCreateEditPage from "pages/design/createEdit/DesignCreateEditPage";
import DesignDetailsPage from "pages/design/details/DesignDetailsPage";
import DesignListPage from "pages/design/index/DesignListPage";
import InventoryDetailsPage from "pages/inventory/details/InventoryDetailsPage";
import InventoryListPage from "pages/inventory/index/InventoryListPage";
import LocationCreateEditPage from "pages/location/createEdit/LocationCreateEditPage";
import LocationDetailsPage from "pages/location/details/LocationDetailsPage";
import LocationListPage from "pages/location/index/LocationListPage";
import ProductCreateEditPage from "pages/products/createEdit/ProductCreateEditPage";
import ProductDetailsPage from "pages/products/details/ProductDetailsPage";
import ProductListPage from "pages/products/index/ProductListPage";
import SizeCreateEditPage from "pages/size/createEdit/SizeCreateEditPage";
import SizeDetailsPage from "pages/size/details/SizeDetailsPage";
import SizeListPage from "pages/size/index/SizeListPage";
import StockInCreateEditPage from "pages/stockIn/createEdit/StockInCreateEditPage";
import StockInDetailsPage from "pages/stockIn/details/StockInDetailsPage";
import StockInListPage from "pages/stockIn/index/StockInListPage";
import StockOutCreateEditPage from "pages/stockOut/createEdit/StockOutCreateEditPage";
import StockOutDetailsPage from "pages/stockOut/details/StockOutDetailsPage";
import StockOutListPage from "pages/stockOut/index/StockOutListPage";
import StockReservationCreateEditPage from "pages/stockReservation/createEdit/StockReservationCreateEditPage";
import StockReservationDetailsPage from "pages/stockReservation/details/StockReservationDetailsPage";
import StockReservationListPage from "pages/stockReservation/index/StockReservationListPage";
import StockTransferCreateEditPage from "pages/stockTransfer/createEdit/StockTransferCreateEditPage";
import StockTransferDetailsPage from "pages/stockTransfer/details/StockTransferDetailsPage";
import StockTransferListPage from "pages/stockTransfer/index/StockTransferListPage";
import WarehouseCreateEditPage from "pages/warehouse/createEdit/WarehouseCreateEditPage";
import WarehouseDetailsPage from "pages/warehouse/details/WarehouseDetailsPage";
import WarehouseListPage from "pages/warehouse/index/WarehouseListPage";

const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <HomePageNavigator />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "stock-in",
        children: [
          {
            path: "",
            element: <StockInListPage />,
          },
          {
            path: "new",
            element: <StockInCreateEditPage />,
          },
          {
            path: ":id",
            element: <StockInDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <StockInCreateEditPage />,
          },
        ],
      },
      {
        path: "stock-out",
        children: [
          {
            path: "",
            element: <StockOutListPage />,
          },
          {
            path: "new",
            element: <StockOutCreateEditPage />,
          },
          {
            path: ":id",
            element: <StockOutDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <StockOutCreateEditPage />,
          },
        ],
      },
      {
        path: "stock-transfer",
        children: [
          {
            path: "",
            element: <StockTransferListPage />,
          },
          {
            path: "new",
            element: <StockTransferCreateEditPage />,
          },
          {
            path: ":id",
            element: <StockTransferDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <StockTransferCreateEditPage />,
          },
        ],
      },
      {
        path: "stock-reservation",
        children: [
          {
            path: "",
            element: <StockReservationListPage />,
          },
          {
            path: "new",
            element: <StockReservationCreateEditPage />,
          },
          {
            path: ":id",
            element: <StockReservationDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <StockReservationCreateEditPage />,
          },
        ],
      },
      {
        path: "category",
        children: [
          {
            path: "",
            element: <CategoryListPage />,
          },
          {
            path: "new",
            element: <CategoryCreateEditPage />,
          },
          {
            path: ":id",
            element: <CategoryDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <CategoryCreateEditPage />,
          },
        ],
      },
      {
        path: "colour",
        children: [
          {
            path: "",
            element: <ColourListPage />,
          },
          {
            path: "new",
            element: <ColourCreateEditPage />,
          },
          {
            path: ":id",
            element: <ColourDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <ColourCreateEditPage />,
          },
        ],
      },
      {
        path: "design",
        children: [
          {
            path: "",
            element: <DesignListPage />,
          },
          {
            path: "new",
            element: <DesignCreateEditPage />,
          },
          {
            path: ":id",
            element: <DesignDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <DesignCreateEditPage />,
          },
        ],
      },
      {
        path: "location",
        children: [
          {
            path: "",
            element: <LocationListPage />,
          },
          {
            path: "new",
            element: <LocationCreateEditPage />,
          },
          {
            path: ":id",
            element: <LocationDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <LocationCreateEditPage />,
          },
        ],
      },
      {
        path: "product",
        children: [
          {
            path: "",
            element: <ProductListPage />,
          },
          {
            path: "new",
            element: <ProductCreateEditPage />,
          },
          {
            path: ":id",
            element: <ProductDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <ProductCreateEditPage />,
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "",
            element: <InventoryListPage />,
          },
          {
            path: ":id",
            element: <InventoryDetailsPage />,
          },
        ],
      },
      {
        path: "size",
        children: [
          {
            path: "",
            element: <SizeListPage />,
          },
          {
            path: "new",
            element: <SizeCreateEditPage />,
          },
          {
            path: ":id",
            element: <SizeDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <SizeCreateEditPage />,
          },
        ],
      },
      {
        path: "cartonSize",
        children: [
          {
            path: "",
            element: <CartonSizeListPage />,
          },
          {
            path: "new",
            element: <CartonSizeCreateEditPage />,
          },
          {
            path: ":id",
            element: <CartonSizeDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <CartonSizeCreateEditPage />,
          },
        ],
      },
      {
        path: "warehouse",
        children: [
          {
            path: "",
            element: <WarehouseListPage />,
          },
          {
            path: "new",
            element: <WarehouseCreateEditPage />,
          },
          {
            path: ":id",
            element: <WarehouseDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <WarehouseCreateEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: "auth",
    element: (
      <GuestGuard>
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

      /*{
        path: "sign-up",
        element: <SignUp />,
      },*/
    ],
  },
  {
    path: "404",
    element: <Page404 />,
  },
  {
    path: "500",
    element: <Page500 />,
  },
];

export default routes;
