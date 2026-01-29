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
  name: string;
  supplierCode: string;
}

type SupplierQuickCreateDialogProps = {
  open: boolean;
  initialName?: string;
  onClose: () => void;
  onCreated: (supplier: SupplierQuickCreateResult) => void;
};

const SupplierQuickCreateDialog = ({
  open,
  initialName,
  onClose,
  onCreated,
}: SupplierQuickCreateDialogProps) => {
  const { t } = useTranslation("common");
  const supplierService = useSupplierService();
  const notificationService = useNotificationService();

  const [supplierName, setSupplierName] = useState(initialName ?? "");
  const [ic, setIc] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address4, setAddress4] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSupplierName(initialName ?? "");
      setIc("");
      setTaxId("");
      setAddress1("");
      setAddress2("");
      setAddress3("");
      setAddress4("");
      setContactNo("");
      setEmail("");
    }
  }, [open, initialName]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedName = supplierName.trim();
    const trimmedIc = ic.trim();
    const trimmedTaxId = taxId.trim();
    const trimmedAddress1 = address1.trim();
    const trimmedAddress2 = address2.trim();
    const trimmedAddress3 = address3.trim();
    const trimmedAddress4 = address4.trim();
    const trimmedContactNo = contactNo.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: SupplierCreateUpdateDto = {
        name: trimmedName,
        ic: trimmedIc || undefined,
        taxId: trimmedTaxId || undefined,
        address1: trimmedAddress1 || undefined,
        address2: trimmedAddress2 || undefined,
        address3: trimmedAddress3 || undefined,
        address4: trimmedAddress4 || undefined,
        contactNo: trimmedContactNo || undefined,
        email: trimmedEmail || undefined,
      };
      const supplier = await supplierService.createSupplier(payload);
      onCreated({
        id: supplier.id,
        supplierCode: supplier.supplierCode,
        name: supplier.name,
      });
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

  const actionDisabled = submitting || supplierName.trim().length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t("add-supplier")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={4}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t("name")}
              value={supplierName}
              onChange={(event) => setSupplierName(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("ic")}
              value={ic}
              onChange={(event) => setIc(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("tax-id")}
              value={taxId}
              onChange={(event) => setTaxId(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("address1")}
              value={address1}
              onChange={(event) => setAddress1(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("address2")}
              value={address2}
              onChange={(event) => setAddress2(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("address3")}
              value={address3}
              onChange={(event) => setAddress3(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("address4")}
              value={address4}
              onChange={(event) => setAddress4(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("contact-no")}
              value={contactNo}
              onChange={(event) => setContactNo(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
