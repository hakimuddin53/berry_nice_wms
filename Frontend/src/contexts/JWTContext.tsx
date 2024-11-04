import { createContext, ReactNode, useEffect, useReducer } from "react";

import {
  ActionMap,
  AuthExternalUser,
  AuthState,
  AuthUser,
  JWTContextType,
} from "../types/auth";

import { useTranslation } from "react-i18next";
import { useUserService } from "services/UserService";
import { guid } from "types/guid";
import axios from "../utils/axios";

// Note: If you're trying to connect JWT to your own backend, don't forget
// to remove the Axios mocks in the `/src/index.tsx` file.

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";
const UPDATE_LOCALE = "UPDATE_LOCALE";

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [SIGN_IN]: {
    user: AuthUser;
  };
  [SIGN_OUT]: undefined;
  [SIGN_UP]: {
    user: AuthUser;
  };
  [UPDATE_LOCALE]: {
    locale: string;
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (
  state: AuthState,
  action: ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case UPDATE_LOCALE:
      return {
        ...state,
        user: { ...state.user, locale: action.payload.locale },
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  const UserService = useUserService();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const initialize = async () => {
      try {
        let isAuthenticated = false;
        const response = await axios.get("/v12/auth/is-authenticated", {
          withCredentials: true,
        });
        if (response.data) {
          isAuthenticated = true;
        }

        if (isAuthenticated) {
          const user = await UserService.getCurrentUserDetails();
          i18n.changeLanguage(user.locale);

          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [i18n]);
  /* eslint-enable */
  const signIn = async (email: string, password: string) => {
    await axios.post("/v12/auth/sign-in", {
      email,
      password,
    });
    const user = await UserService.getCurrentUserDetails();
    i18n.changeLanguage(user.locale);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
      },
    });
  };

  const updateLocale = (locale: string) => {
    dispatch({
      type: UPDATE_LOCALE,
      payload: {
        locale,
      },
    });
  };

  const signOut = async () => {
    await axios.post("/v12/auth/sign-out");
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const response = await axios.post("/api/auth/sign-up", {
      email,
      password,
      firstName,
      lastName,
    });
    const { user } = response.data;
    dispatch({
      type: SIGN_UP,
      payload: {
        user,
      },
    });
  };

  const resetPassword = (email: string) => console.log(email);

  const tokenLogin = async (token: string, email: string) => {
    await axios.post("/v12/auth/token-login", {
      LoginEmail: email,
      LoginToken: token,
    });

    const user = await UserService.getCurrentUserDetails();
    i18n.changeLanguage(user.locale);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
      },
    });
  };

  const externalEmailSignIn = async (
    companyId: guid,
    email: string,
    locationId: guid
  ) => {
    await axios.post("/v12/auth/external-email-login", {
      companyId,
      email,
      locationId,
    });

    return;
  };

  const externalJwtSignIn = async (jwt: string) => {
    let response = await axios.post("/v12/auth/external-jwt-login", {
      jwt,
    });

    if (response.data) {
      return response.data as AuthExternalUser;
    } else {
      const user = await UserService.getCurrentUserDetails();
      i18n.changeLanguage(user.locale);
      dispatch({
        type: SIGN_IN,
        payload: {
          user,
        },
      });

      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
        tokenLogin,
        externalEmailSignIn,
        externalJwtSignIn,
        updateLocale,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
