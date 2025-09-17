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

import DashboardPage from "pages/dashboard/DashboardPage";

import InventoryListPage from "pages/inventory/InventoryListPage";

import LookupCreateEditPage from "pages/lookup/createEdit/LookupCreateEditPage";
import LookupDetailsPage from "pages/lookup/details/LookupDetailsPage";
import LookupListPage from "pages/lookup/index/LookupListPage";
import ProductBulkUploadPage from "pages/products/bulkUpload/ProductBulkUploadPage";
import ProductCreateEditPage from "pages/products/createEdit/ProductCreateEditPage";
import ProductDetailsPage from "pages/products/details/ProductDetailsPage";
import ProductListPage from "pages/products/index/ProductListPage";
import UserCreateEditPage from "pages/user/createEdit/UserCreateEditPage";
import UserDetailsPage from "pages/user/details/UserDetailsPage";
import UserListPage from "pages/user/index/UserListPage";
import UserRoleCreateEditPage from "pages/userRoles/createEdit/UserRoleCreateEditPage";
import UserRoleDetailsPage from "pages/userRoles/details/UserRoleDetailsPage";
import UserRoleListPage from "pages/userRoles/index/UserRoleListPage";
import CustomerCreateEditPage from "pages/customer/createEdit/CustomerCreateEditPage";
import CustomerDetailsPage from "pages/customer/details/CustomerDetailsPage";
import CustomerListPage from "pages/customer/index/CustomerListPage";
import SupplierCreateEditPage from "pages/supplier/createEdit/SupplierCreateEditPage";
import SupplierDetailsPage from "pages/supplier/details/SupplierDetailsPage";
import SupplierListPage from "pages/supplier/index/SupplierListPage";
import ExpenseCreateEditPage from "pages/expense/createEdit/ExpenseCreateEditPage";
import ExpenseDetailsPage from "pages/expense/details/ExpenseDetailsPage";

import { Navigate } from "react-router-dom";
import ExpenseListPage from "pages/expense/index/ExpenseListPage";

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
        path: "customer",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CUSTOMER}>
                <CustomerListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CUSTOMER}>
                <CustomerCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CUSTOMER}>
                <CustomerDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.CUSTOMER}>
                <CustomerCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "supplier",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SUPPLIER}>
                <SupplierListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SUPPLIER}>
                <SupplierCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SUPPLIER}>
                <SupplierDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.SUPPLIER}>
                <SupplierCreateEditPage />
              </ModuleGuard>
            ),
          },
        ],
      },
      {
        path: "expense",
        children: [
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.EXPENSE}>
                <ExpenseListPage />
              </ModuleGuard>
            ),
          },
          {
            path: "new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.EXPENSE}>
                <ExpenseCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.EXPENSE}>
                <ExpenseDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.EXPENSE}>
                <ExpenseCreateEditPage />
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
        path: "lookups",
        children: [
          // optional: opening /lookups redirects to a default group
          {
            index: true,
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOOKUP}>
                <Navigate to="CustomerType" replace />
              </ModuleGuard>
            ),
          },
          {
            path: ":groupKey",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOOKUP}>
                <LookupListPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":groupKey/new",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOOKUP}>
                <LookupCreateEditPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":groupKey/:id",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOOKUP}>
                <LookupDetailsPage />
              </ModuleGuard>
            ),
          },
          {
            path: ":groupKey/:id/edit",
            element: (
              <ModuleGuard requiredModule={ModuleEnum.LOOKUP}>
                <LookupCreateEditPage />
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
