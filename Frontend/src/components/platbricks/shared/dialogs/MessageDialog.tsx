import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type MessageDialogProps = {
  open: boolean;
  title: string;
  messages: string[];
  onClose: () => void;
};

const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  title,
  messages,
  onClose,
}) => {
  const { t } = useTranslation();
  const fallbackMessage =
    t("common:request-failed", { defaultValue: "Request failed" }) || "-";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {fallbackMessage}
          </Typography>
        ) : (
          <List dense>
            {messages.map((msg, index) => (
              <ListItem key={`${msg}-${index}`} disableGutters>
                <ListItemText primary={msg} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t("common:close", { defaultValue: "Close" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
