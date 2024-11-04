import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tx, useBlocker } from "../../../hooks/useBlocker";

type NavBlockerProps = {
  when?: boolean;
};

export const NavBlocker: FC<NavBlockerProps> = ({ when }) => {
  const [block, setBlock] = useState(when);
  const [visible, setVisible] = useState(false);
  const [tx, setTx] = useState<Tx | undefined>();
  const { t } = useTranslation();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const skip = () => {
    setBlock(false);
    setTimeout(() => {
      tx?.retry();
      hide();
    }, 0);
  };

  useEffect(() => {
    setBlock(when);
  }, [when]);

  useBlocker((tx: Tx) => {
    setTx(tx);
    show();
  }, block);

  return (
    <Dialog onClose={hide} aria-labelledby="simple-dialog-title" open={visible}>
      <DialogTitle id="simple-dialog-title">{t("common:warning")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("this-site-contains-unsaved-changes-proceed")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hide}>{t("common:cancel")}</Button>
        <Button onClick={skip}>
          {t("common:discard-changes-and-continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
