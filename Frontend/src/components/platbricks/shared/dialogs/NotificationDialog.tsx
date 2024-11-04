import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogTitleProps,
  List,
  ListItem,
  ListItemText,
  styled,
} from "@mui/material";
import { SignalRHubResultMessage } from "interfaces/general/signalRMessage/signalRMessageInterfaces";
import { useTranslation } from "react-i18next";
import { format } from "utils/stringFormatter";

// Styling
interface StyledDialogTitleProps extends DialogTitleProps {
  type?: string;
}

const ColoredDialogTitle = styled(DialogTitle, {
  shouldForwardProp: (prop) => prop !== "type",
})<StyledDialogTitleProps>(({ type, theme }) => ({
  ...(type === "default" && {
    background: "#FFF",
    color: "rgba(0, 0, 0, 0.87)",
  }),
  ...(type === "success" && {
    background: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(type === "warning" && {
    background: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  }),
  ...(type === "error" && {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }),
}));

//

export interface NotificationDialogProps {
  open: boolean;
  title: string;
  titleKey?: string;
  titleArgs?: string[];
  type: "default" | "success" | "warning" | "error";
  message: string;
  subMessages: string[] | SignalRHubResultMessage[];
  onClose: () => void;
}

export const NotificationDialog = (props: NotificationDialogProps) => {
  const { t } = useTranslation("validationResult");
  let count = 0;

  return (
    <Dialog onClose={props.onClose} open={props.open} fullWidth>
      <ColoredDialogTitle id="notification-dialog-title" type={props.type}>
        {props.titleKey
          ? format(
              t(props.titleKey, { ns: "signalr" }).toString(),
              ...(props.titleArgs ?? [])
            )
          : props.title ?? t("common:notification")}
      </ColoredDialogTitle>
      <DialogContent>
        <br></br>
        <DialogContentText>{props.message}</DialogContentText>
        <List>
          {props.titleKey
            ? (props.subMessages as SignalRHubResultMessage[]).map((p) => (
                <ListItem key={`${"sub-message"}${count++}`} disablePadding>
                  <ListItemText
                    primary={format(
                      t(p.key, { ns: "signalr" }).toString(),
                      ...(p.args ?? [])
                    )}
                  />
                </ListItem>
              ))
            : (props.subMessages as string[]).map((p: string) => (
                <ListItem key={`${"sub-message"}${count++}`} disablePadding>
                  <ListItemText primary={p} />
                </ListItem>
              ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t("common:close")}</Button>
      </DialogActions>
    </Dialog>
  );
};
