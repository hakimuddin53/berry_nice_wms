import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { CustomerCreateUpdateDto } from "interfaces/v12/customer/customerCreateUpdate/customerCreateUpdateDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerService } from "services/CustomerService";
import { useNotificationService } from "services/NotificationService";
import { guid } from "types/guid";

export interface CustomerQuickCreateResult {
  id: string;
  name: string;
  phone?: string;
  customerTypeId: string;
}

type CustomerQuickCreateDialogProps = {
  open: boolean;
  initialName?: string;
  initialPhone?: string;
  initialCustomerTypeId?: string;
  onClose: () => void;
  onCreated: (customer: CustomerQuickCreateResult) => void;
};

const CustomerQuickCreateDialog = ({
  open,
  initialName,
  initialPhone,
  initialCustomerTypeId,
  onClose,
  onCreated,
}: CustomerQuickCreateDialogProps) => {
  const { t } = useTranslation("common");
  const customerService = useCustomerService();
  const notificationService = useNotificationService();

  const [name, setName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [customerTypeId, setCustomerTypeId] = useState(
    initialCustomerTypeId ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName ?? "");
      setPhone(initialPhone ?? "");
      setEmail("");
      setAddress("");
      setCustomerTypeId(initialCustomerTypeId ?? "");
    }
  }, [open, initialName, initialPhone, initialCustomerTypeId]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    if (!trimmedName || !customerTypeId) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: CustomerCreateUpdateDto = {
        name: trimmedName,
        phone: trimmedPhone || undefined,
        email: trimmedEmail || undefined,
        address: trimmedAddress || undefined,
        customerTypeId: guid(customerTypeId),
      };
      const id = await customerService.createCustomer(payload);
      onCreated({
        id,
        name: trimmedName,
        phone: payload.phone,
        customerTypeId,
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

  const actionDisabled =
    submitting || name.trim().length === 0 || customerTypeId.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t("add-customer")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={4}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t("name")}
              value={name}
              onChange={(event) => setName(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t("phone")}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
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
            <TextField
              fullWidth
              label={t("address")}
              multiline
              rows={2}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              size="small"
              disabled={submitting}
            />
            <LookupAutocomplete
              groupKey={LookupGroupKey.CustomerType}
              name="customerTypeId"
              value={customerTypeId}
              onChange={(newValue) => setCustomerTypeId(newValue || "")}
              onBlur={() => undefined}
              error={false}
              helperText={null}
              disableClearable
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

export default CustomerQuickCreateDialog;
