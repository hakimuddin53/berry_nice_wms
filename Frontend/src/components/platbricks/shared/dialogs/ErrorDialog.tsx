import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import i18next from "i18next";
import { ValidationResult } from "interfaces/v12/exceptions/HttpResponseMessageV12Dto";
import React from "react";
import { useNotificationService } from "services/NotificationService";
import { format } from "utils/stringFormatter";

const ErrorDialog: React.FC = (props) => {
  const { dialogErrorState, closeErrorDialog } = useNotificationService();
  const closeHandler = () => {
    closeErrorDialog();
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeErrorDialog();
  };

  return (
    <Dialog
      open={dialogErrorState !== undefined}
      onClose={closeHandler}
      fullWidth={true}
    >
      <Box component="form" onSubmit={submitHandler}>
        <DialogTitle>
          {i18next
            .t(dialogErrorState?.result?.message ?? "", {
              ns: dialogErrorState?.translationNamespace,
            })
            .toString()}
        </DialogTitle>
        <DialogContent style={{ whiteSpace: "break-spaces" }}>
          {(dialogErrorState?.result?.subMessages.length ?? 0) > 0 && (
            <Grid item xs={12}>
              <ul>
                {dialogErrorState?.result?.subMessages.map((result, index) => (
                  <li style={{ color: "red" }} key={index}>
                    {i18next
                      .t(result.message, {
                        ns: dialogErrorState?.translationNamespace,
                      })
                      .toString()}
                  </li>
                ))}
                {dialogErrorState?.result?.responseMessageAttributes?.map(
                  (message, index) => {
                    let validationResult: ValidationResult = JSON.parse(
                      message.value
                    );
                    if (validationResult.arguments === null) {
                      validationResult.arguments = [];
                    }
                    let formattedMessage = format(
                      i18next.t(validationResult.errorCode, {
                        ns: "validationResult",
                      }),
                      ...validationResult.arguments
                    );

                    return (
                      <li style={{ color: "red" }} key={index}>
                        {i18next
                          .t(formattedMessage, {
                            ns: dialogErrorState?.translationNamespace,
                          })
                          .toString()}
                      </li>
                    );
                  }
                )}
              </ul>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeHandler();
            }}
            color="primary"
            type="button"
          >
            {i18next.t("common:close").toString()}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ErrorDialog;
