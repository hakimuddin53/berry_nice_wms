import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import {
  LookupCreateUpdateDto,
  LookupGroupKey,
} from "interfaces/v12/lookup/lookup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLookupService } from "services/LookupService";
import { useNotificationService } from "services/NotificationService";

type LookupQuickCreateDialogProps = {
  open: boolean;
  groupKey: LookupGroupKey;
  initialLabel?: string;
  initialSortOrder?: number;
  onClose: () => void;
  onCreated: (lookup: { id: string; label: string }) => void;
};

const LookupQuickCreateDialog = ({
  open,
  groupKey,
  initialLabel,
  initialSortOrder = 0,
  onClose,
  onCreated,
}: LookupQuickCreateDialogProps) => {
  const { t } = useTranslation("common");
  const lookupService = useLookupService();
  const notificationService = useNotificationService();

  const [label, setLabel] = useState(initialLabel ?? "");
  const [sortOrder, setSortOrder] = useState(initialSortOrder || 1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setLabel(initialLabel ?? "");
      setSortOrder(initialSortOrder || 1);
    }
  }, [initialLabel, initialSortOrder, open]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const payload: LookupCreateUpdateDto = {
        groupKey,
        label: trimmed,
        sortOrder,
        isActive: true,
      };
      const id = await lookupService.create(payload);
      onCreated({ id, label: trimmed });
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

  const actionDisabled = submitting || label.trim().length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t("add")}</DialogTitle>
        <DialogContent sx={{ px: 3, pt: 1.5, pb: 1 }}>
          <Stack spacing={2} mt={0.5}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t("label")}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              size="small"
              disabled={submitting}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
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

export default LookupQuickCreateDialog;
