import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import userCacheReducer from "./slices/userCache";

import snackbarReducer from "./snackbar";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    snackbar: snackbarReducer,
    userCache: userCacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
