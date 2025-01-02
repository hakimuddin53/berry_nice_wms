import { CacheProvider } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { useRoutes } from "react-router-dom";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./i18n";
import routes from "./routes";
import configureTheme from "./theme";

import useTheme from "./hooks/useTheme";
import { store } from "./redux/store";
import createEmotionCache from "./utils/createEmotionCache";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DeleteConfirmationDialogProvider } from "contexts/DeleteConfirmationDialogContext";
import { de, enGB, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { NotificationServiceProvider } from "services/NotificationService";
import { ServicesProvider } from "services/ServicesProvider";
import { ThemeProvider } from "styled-components";
import SnackbarWrapper from "./components/platbricks/global/SnackbarWrapper";
import { AuthProvider } from "./contexts/JWTContext";

const clientSideEmotionCache = createEmotionCache();
function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const getLocale = (): Locale => {
    switch (i18n.language) {
      case "de-De":
        return de;
      case "en-GB":
        return enGB;
      case "en-US":
        return enUS;

      default:
        return de;
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet titleTemplate="%s | platbricks" defaultTitle="platbricks" />
        <Provider store={store}>
          <LocalizationProvider
            // @ts-ignore
            dateAdapter={AdapterDateFns}
            adapterLocale={getLocale()}
          >
            <MuiThemeProvider theme={configureTheme(theme)}>
              <ThemeProvider theme={configureTheme(theme)}>
                <NotificationServiceProvider>
                  <DeleteConfirmationDialogProvider>
                    <ServicesProvider>
                      <>
                        <SnackbarWrapper></SnackbarWrapper>

                        <AuthProvider>{content}</AuthProvider>
                      </>
                    </ServicesProvider>
                  </DeleteConfirmationDialogProvider>
                </NotificationServiceProvider>
              </ThemeProvider>
            </MuiThemeProvider>
          </LocalizationProvider>
        </Provider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;
