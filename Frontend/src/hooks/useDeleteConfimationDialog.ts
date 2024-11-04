import { DeleteConfirmationDialogContext } from "contexts/DeleteConfirmationDialogContext";
import { useContext } from "react";

const useDeleteConfirmationDialog = () => {
  const ctx = useContext(DeleteConfirmationDialogContext);

  if (ctx === undefined) {
    throw new Error(
      "useDeleteConfirmationDialog must be used within DeleteConfirmationDialogProvider"
    );
  }

  return ctx;
};

export default useDeleteConfirmationDialog;
