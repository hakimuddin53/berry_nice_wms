import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";

export interface SnackbarInfo {
  id: number;
  message: string;
}

export interface SnackbarState {
  data: SnackbarInfo[];
}

const initialState: SnackbarState = {
  data: [],
};

export const addMessage =
  (payload: { message: string }): AppThunk =>
  (dispatch, getState) => {
    const id = Date.now();
    dispatch(
      snackbarSlice.actions.addMessage({
        id: id,
        message: payload.message,
      })
    );
  };

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<SnackbarInfo>) => {
      state.data.push({
        id: action.payload.id,
        message: action.payload.message,
      });
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((x) => x.id !== action.payload);
    },
  },
});

export const { deleteMessage } = snackbarSlice.actions;

export const snackbarData = (state: RootState) => state.snackbar.data;
export default snackbarSlice.reducer;
