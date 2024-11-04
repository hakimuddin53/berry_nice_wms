import { DeleteConfirmationDialog } from "components/platbricks/shared/dialogs/DeleteConfirmationDialog";
import React, { useCallback, useReducer } from "react";

enum DeleteConfirmationDialogActionType {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}

interface DeleteConfirmationDialogAction {
  type: DeleteConfirmationDialogActionType;
  payload?: DeleteConfirmationDialogParameter;
}

export interface DeleteConfirmationDialogParameter {
  onConfirmDeletion: () => Promise<void>;
  setPageBlocker: (newState: boolean) => void;
  entity: string;
  translationNamespace: string;
  onCloseDialog?: () => void;
  deleteDataName?: string;
  message?: string;
  redirectLink?: string;
  allowBackdropClose?: boolean;
}

export interface DeleteConfirmationDialogState
  extends DeleteConfirmationDialogParameter {
  open: boolean;
}

const initialState: DeleteConfirmationDialogState = {
  open: false,
  onConfirmDeletion: () => Promise.resolve(),
  setPageBlocker: (newState: boolean) => {},
  entity: "",
  translationNamespace: "",
  onCloseDialog: () => {},
  deleteDataName: "",
  message: "",
  redirectLink: "",
  allowBackdropClose: true,
};

export const DeleteConfirmationDialogContext = React.createContext({
  State: initialState,
  OpenDeleteConfirmationDialog: (
    params: DeleteConfirmationDialogParameter
  ) => {},
  CloseDeleteConfirmationDialog: () => {},
});

export const DeleteConfirmationDialogReducer = (
  state: DeleteConfirmationDialogState,
  action: DeleteConfirmationDialogAction
) => {
  switch (action.type) {
    case DeleteConfirmationDialogActionType.OPEN:
      const payload = action.payload;
      if (payload) {
        return {
          ...payload,
          open: true,
        };
      }
      return state;
    case DeleteConfirmationDialogActionType.CLOSE:
      return {
        ...state,
        open: false,
      };
    default:
      return initialState;
  }
};

export const DeleteConfirmationDialogProvider: React.FC<any> = (props) => {
  const [state, dispatch] = useReducer(
    DeleteConfirmationDialogReducer,
    initialState
  );

  const openDialog = useCallback(
    (params: DeleteConfirmationDialogParameter) => {
      dispatch({
        type: DeleteConfirmationDialogActionType.OPEN,
        payload: { ...params },
      });
    },
    [dispatch]
  );

  const closeDialog = useCallback(() => {
    dispatch({ type: DeleteConfirmationDialogActionType.CLOSE });
  }, [dispatch]);

  return (
    <DeleteConfirmationDialogContext.Provider
      value={{
        State: state,
        OpenDeleteConfirmationDialog: openDialog,
        CloseDeleteConfirmationDialog: closeDialog,
      }}
    >
      {props.children}
      <DeleteConfirmationDialog />
    </DeleteConfirmationDialogContext.Provider>
  );
};
