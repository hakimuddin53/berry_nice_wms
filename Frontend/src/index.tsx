import "react-app-polyfill/stable";
import { SnackbarUtilsConfigurator } from "./utils/SnackBarUtils";
import "./wdyr";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "chart.js/auto";

import "./utils/setYupLocales";

import App from "./App";
import reportWebVitals from "./utils/reportWebVitals";

// Note: Remove the following line if you want to disable the API mocks.
//import "./mocks";

import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "./contexts/ThemeContext";

const container = document.getElementById("root");
const root = createRoot(container!);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoHideDuration={5000}
      >
        <>
          <SnackbarUtilsConfigurator />
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </>
      </SnackbarProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
