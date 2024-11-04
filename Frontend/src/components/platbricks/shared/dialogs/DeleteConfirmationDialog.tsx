import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";

export const DeleteConfirmationDialog: React.FC = () => {
  const { State, CloseDeleteConfirmationDialog } =
    useDeleteConfirmationDialog();

  const {
    open,
    onConfirmDeletion,
    setPageBlocker,
    entity,
    translationNamespace,
    onCloseDialog,
    deleteDataName,
    message,
    redirectLink,
    allowBackdropClose,
  } = State;

  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setPageBlocker(true);
    CloseDeleteConfirmationDialog();

    await onConfirmDeletion()
      .then(() => {
        setPageBlocker(false);
        notificationService.handleApiSuccessMessage(
          entity,
          "deleted",
          translationNamespace,
          deleteDataName
        );

        if (redirectLink) {
          setTimeout(() => {
            navigate(redirectLink);
          }, 100);
        }
      })
      .catch((err) => {
        setPageBlocker(false);
        notificationService.handleApiErrorMessage(
          err.data,
          translationNamespace
        );
      });
  };

  const closeHandler = (event: object, reason: string) => {
    if (!(allowBackdropClose ?? true) && reason && reason === "backdropClick")
      return;

    closeDialog();
  };

  const closeDialog = () => {
    CloseDeleteConfirmationDialog();
    if (onCloseDialog) onCloseDialog();
  };

  return (
    <Dialog fullWidth={true} maxWidth={"xs"} open={open} onClose={closeHandler}>
      <DialogTitle>
        {i18next.t("common:confirm-deletion").toString()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message ?? i18next.t("common:confirm-deletion-message").toString()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="default" variant="contained">
          {i18next.t("common:cancel").toString()}
        </Button>
        <Button
          onClick={submitHandler}
          color="error"
          variant="contained"
          startIcon={<Delete />}
        >
          {i18next.t("common:confirm").toString()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
