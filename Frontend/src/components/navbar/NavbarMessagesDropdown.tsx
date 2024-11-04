import styled from "@emotion/styled";
import React, { useRef, useState } from "react";

import {
  Badge,
  Box,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Popover as MuiPopover,
  Tooltip,
  Typography,
} from "@mui/material";
import { Flag } from "react-feather";
import { useTranslation } from "react-i18next";

const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const MessageHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function LinearProgressWithLabel(
  props: LinearProgressProps & {
    progresstitle: string;
    value: number;
    progresscolor:
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
      | "inherit";
  }
) {
  return (
    <>
      <Tooltip title={props.progresstitle} placement="left">
        <Box sx={{ width: "100%", pl: 2, pr: 2, pt: 3, pb: 3 }}>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Typography noWrap>{props.progresstitle}</Typography>
            <Typography
              sx={{ fontSize: 9 }}
              variant="subtitle2"
              align="right"
            >{`${Math.round(props.value)}%`}</Typography>
          </Box>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                sx={{ height: 7, borderRadius: 1 }}
                variant="determinate"
                color={props.progresscolor}
                {...props}
              />
            </Box>
          </Box>
        </Box>
      </Tooltip>
    </>
  );
}

function NavbarMessagesDropdown() {
  const { t } = useTranslation("navbar");
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenDialogWithDownload, setIsOpenDialogWithDownload] =
    useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeNotificationDialog = () => {
    setIsOpenDialog(false);
  };

  const closeNotificationDialogWithDownload = () => {
    setIsOpenDialogWithDownload(false);
  };

  return (
    <React.Fragment>
      <Tooltip title={t("messages")}>
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Badge badgeContent={1} color="secondary">
            <Flag />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <MessageHeader p={2}>
          <Typography variant="subtitle1" color="textPrimary">
            {t("tasks-in-progress")}
          </Typography>
        </MessageHeader>
        <React.Fragment></React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarMessagesDropdown;
