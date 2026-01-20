import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { SupplierCreateUpdateDto } from "interfaces/v12/supplier/supplierCreateUpdate/supplierCreateUpdateDto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotificationService } from "services/NotificationService";
import { useSupplierService } from "services/SupplierService";

export interface SupplierQuickCreateResult {
  id: string;
  supplierCode: string;
  name: string;
}

type SupplierQuickCreateDialogProps = {
  open: boolean;
  initialCode?: string;
  initialName?: string;
  onClose: () => void;
  onCreated: (supplier: SupplierQuickCreateResult) => void;
};

const SupplierQuickCreateDialog = ({
  open,
  initialCode,
  initialName,
  onClose,
  onCreated,
}: SupplierQuickCreateDialogProps) => {
  const { t } = useTranslation("common");
  const supplierService = useSupplierService();
  const notificationService = useNotificationService();

  const [supplierCode, setSupplierCode] = useState(initialCode ?? "");
  const [supplierName, setSupplierName] = useState(initialName ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSupplierCode(initialCode ?? "");
      setSupplierName(initialName ?? "");
    }
  }, [open, initialCode, initialName]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedCode = supplierCode.trim();
    const trimmedName = supplierName.trim();
    if (!trimmedCode || !trimmedName) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: SupplierCreateUpdateDto = {
        supplierCode: trimmedCode,
        name: trimmedName,
      };
      const id = await supplierService.createSupplier(payload);
      onCreated({ id, supplierCode: payload.supplierCode, name: payload.name });
      notificationService.handleSuccessMessage(t("operation-completed"));
    } catch (error: any) {
      const apiError = error?.response?.data;
      if (apiError) {
        notificationService.handleApiErrorMessage(apiError, "common");
      } else {
        notificationService.handleErrorMessage(t("request-failed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const actionDisabled =
    submitting ||
    supplierCode.trim().length === 0 ||
    supplierName.trim().length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t("add-supplier")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t("supplier-code")}
              value={supplierCode}
              onChange={(event) => setSupplierCode(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              label={t("name")}
              value={supplierName}
              onChange={(event) => setSupplierName(event.target.value)}
              size="small"
              disabled={submitting}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={actionDisabled}>
            {t("create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierQuickCreateDialog;
