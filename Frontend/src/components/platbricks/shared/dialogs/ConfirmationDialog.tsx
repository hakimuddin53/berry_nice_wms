import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const ConfirmationDialog = ({
  onClose,
  visible,
  title,
  contentText,
  onConfirm,
}: {
  onClose: () => void;
  visible: boolean;
  title?: string;
  contentText: string;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={onClose} open={visible}>
      <DialogTitle>{title ?? t("common:confirmation")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common:cancel")}</Button>
        <Button onClick={onConfirm}>{t("common:confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
};
