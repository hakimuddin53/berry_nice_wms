import async from "./components/Async";

// All pages that rely on 3rd party components (other than Material-UI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import DocLayout from "./layouts/Doc";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// Auth components
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";
import ResetPassword from "./pages/auth/ResetPassword";
import SignIn from "./pages/auth/SignIn";

// Components
import Accordion from "./examples/components/Accordion";
import Alerts from "./examples/components/Alerts";
import Avatars from "./examples/components/Avatars";
import Badges from "./examples/components/Badges";
import Buttons from "./examples/components/Buttons";
import Cards from "./examples/components/Cards";
import Chips from "./examples/components/Chips";
import Dialogs from "./examples/components/Dialogs";
import Lists from "./examples/components/Lists";
import Menus from "./examples/components/Menus";
import Pagination from "./examples/components/Pagination";
import Progress from "./examples/components/Progress";
import Snackbars from "./examples/components/Snackbars";
import Tooltips from "./examples/components/Tooltips";

// Form components
import SelectionCtrls from "./examples/forms/SelectionControls";
import Selects from "./examples/forms/Selects";
import TextFields from "./examples/forms/TextFields";

// Icon components
import MaterialIcons from "./examples/icons/MaterialIcons";

// Page components
import Blank from "./examples/pages/Blank";
import Chat from "./examples/pages/Chat";
import InvoiceDetails from "./examples/pages/InvoiceDetails";
import InvoiceList from "./examples/pages/InvoiceList";
import Orders from "./examples/pages/Orders";
import Pricing from "./examples/pages/Pricing";
import Projects from "./examples/pages/Projects";
import Settings from "./examples/pages/Settings";

// Table components
import AdvancedTable from "./examples/tables/AdvancedTable";
import SimpleTable from "./examples/tables/SimpleTable";

// Documentation
import APICalls from "./examples/docs/APICalls";
import Auth0 from "./examples/docs/auth/Auth0";
import Cognito from "./examples/docs/auth/Cognito";
import Firebase from "./examples/docs/auth/Firebase";
import JWT from "./examples/docs/auth/JWT";
import Changelog from "./examples/docs/Changelog";
import Deployment from "./examples/docs/Deployment";
import EnvironmentVariables from "./examples/docs/EnvironmentVariables";
import ESLintAndPrettier from "./examples/docs/ESLintAndPrettier";
import GettingStarted from "./examples/docs/GettingStarted";
import Guards from "./examples/docs/Guards";
import Internationalization from "./examples/docs/Internationalization";
import MigratingToNextJS from "./examples/docs/MigratingToNextJS";
import Redux from "./examples/docs/Redux";
import Routing from "./examples/docs/Routing";
import Support from "./examples/docs/Support";
import Theming from "./examples/docs/Theming";
import Welcome from "./examples/docs/Welcome";

// Protected routes
import ExternalSignIn from "components/auth/ExternalSignIn";
import GuestGuard from "components/guards/GuestGuard";
import { HomePageNavigator } from "components/platbricks/shared/HomePageNavigator";
import ProtectedPage from "examples/protected/ProtectedPage";
import EventSettingCreateEditPage from "pages/eventSettings/createEdit/EventSettingCreateEditPage";
import EventSettingDetailsPage from "pages/eventSettings/details/EventSettingDetailsPage";
import EventSettingListPage from "pages/eventSettings/index/EventSettingListPage";

// Dashboard components
const Analytics = async(() => import("./examples/dashboards/Analytics"));
const SaaS = async(() => import("./examples/dashboards/SaaS"));

// Form components
const Pickers = async(() => import("./examples/forms/Pickers"));
const Editors = async(() => import("./examples/forms/Editors"));
const Formik = async(() => import("./examples/forms/Formik"));

// Icon components
const FeatherIcons = async(() => import("./examples/icons/FeatherIcons"));
const Profile = async(() => import("./examples/pages/Profile"));
const Tasks = async(() => import("./examples/pages/Tasks"));
const Calendar = async(() => import("./examples/pages/Calendar"));

// Table components
const DataGrid = async(() => import("./examples/tables/DataGrid"));

// Chart components
const Chartjs = async(() => import("./examples/charts/Chartjs"));

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
        path: "pages",
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "pricing",
            element: <Pricing />,
          },
          {
            path: "chat",
            element: <Chat />,
          },
          {
            path: "blank",
            element: <Blank />,
          },
        ],
      },
      {
        path: "projects",
        children: [
          {
            path: "",
            element: <Projects />,
          },
        ],
      },
      {
        path: "invoices",
        children: [
          {
            path: "",
            element: <InvoiceList />,
          },
          {
            path: "detail",
            element: <InvoiceDetails />,
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            path: "",
            element: <Orders />,
          },
        ],
      },
      {
        path: "tasks",
        children: [
          {
            path: "",
            element: <Tasks />,
          },
        ],
      },
      {
        path: "calendar",
        children: [
          {
            path: "",
            element: <Calendar />,
          },
        ],
      },
      {
        path: "event-settings",
        children: [
          {
            path: "",
            element: <EventSettingListPage />,
          },
          {
            path: "new",
            element: <EventSettingCreateEditPage />,
          },
          {
            path: ":id",
            element: <EventSettingDetailsPage />,
          },
          {
            path: ":id/edit",
            element: <EventSettingCreateEditPage />,
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
      {
        path: "sign-in/external",
        element: <ExternalSignIn />,
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
  {
    path: "components",
    element: <DashboardLayout />,
    children: [
      {
        path: "accordion",
        element: <Accordion />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "avatars",
        element: <Avatars />,
      },
      {
        path: "badges",
        element: <Badges />,
      },
      {
        path: "buttons",
        element: <Buttons />,
      },
      {
        path: "cards",
        element: <Cards />,
      },
      {
        path: "chips",
        element: <Chips />,
      },
      {
        path: "dialogs",
        element: <Dialogs />,
      },
      {
        path: "lists",
        element: <Lists />,
      },
      {
        path: "menus",
        element: <Menus />,
      },
      {
        path: "pagination",
        element: <Pagination />,
      },
      {
        path: "progress",
        element: <Progress />,
      },
      {
        path: "snackbars",
        element: <Snackbars />,
      },
      {
        path: "tooltips",
        element: <Tooltips />,
      },
    ],
  },
  {
    path: "forms",
    element: <DashboardLayout />,
    children: [
      {
        path: "pickers",
        element: <Pickers />,
      },
      {
        path: "selection-controls",
        element: <SelectionCtrls />,
      },
      {
        path: "selects",
        element: <Selects />,
      },
      {
        path: "text-fields",
        element: <TextFields />,
      },
      {
        path: "editors",
        element: <Editors />,
      },
      {
        path: "formik",
        element: <Formik />,
      },
    ],
  },
  {
    path: "tables",
    element: <DashboardLayout />,
    children: [
      {
        path: "simple-table",
        element: <SimpleTable />,
      },
      {
        path: "advanced-table",
        element: <AdvancedTable />,
      },
      {
        path: "data-grid",
        element: <DataGrid />,
      },
    ],
  },
  {
    path: "icons",
    element: <DashboardLayout />,
    children: [
      {
        path: "material-icons",
        element: <MaterialIcons />,
      },
      {
        path: "feather-icons",
        element: <FeatherIcons />,
      },
    ],
  },
  {
    path: "charts",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Chartjs />,
      },
    ],
  },
  {
    path: "documentation",
    element: <DocLayout />,
    children: [
      {
        path: "welcome",
        element: <Welcome />,
      },
      {
        path: "getting-started",
        element: <GettingStarted />,
      },
      {
        path: "routing",
        element: <Routing />,
      },
      {
        path: "auth/auth0",
        element: <Auth0 />,
      },
      {
        path: "auth/cognito",
        element: <Cognito />,
      },
      {
        path: "auth/firebase",
        element: <Firebase />,
      },
      {
        path: "auth/jwt",
        element: <JWT />,
      },
      {
        path: "guards",
        element: <Guards />,
      },
      {
        path: "environment-variables",
        element: <EnvironmentVariables />,
      },
      {
        path: "deployment",
        element: <Deployment />,
      },
      {
        path: "theming",
        element: <Theming />,
      },
      {
        path: "api-calls",
        element: <APICalls />,
      },
      {
        path: "redux",
        element: <Redux />,
      },
      {
        path: "internationalization",
        element: <Internationalization />,
      },
      {
        path: "eslint-and-prettier",
        element: <ESLintAndPrettier />,
      },
      {
        path: "migrating-to-next-js",
        element: <MigratingToNextJS />,
      },
      {
        path: "support",
        element: <Support />,
      },
    ],
  },
  {
    path: "changelog",
    element: <DocLayout />,
    children: [
      {
        path: "",
        element: <Changelog />,
      },
    ],
  },
  {
    path: "private",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ProtectedPage />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
