import ErrorDialog from "components/platbricks/shared/dialogs/ErrorDialog";
import i18next from "i18next";
import {
  MissingPermissionCode,
  RequestedEntityNotFoundCode,
} from "interfaces/general/permissions/errorHandling";
import {
  HttpResponseMessageV12Dto,
  ValidationResult,
} from "interfaces/v12/exceptions/HttpResponseMessageV12Dto";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { tryParse } from "utils/json";
import { format } from "utils/stringFormatter";

const { createContext, useContext } = React;

export interface DialogErrorState {
  result: HttpResponseMessageV12Dto | undefined;
  translationNamespace: string;
}

interface INotificationService {
  handleApiErrorMessage: (
    result: HttpResponseMessageV12Dto,
    translationNamespace: string
  ) => void;
  handleApiSuccessMessage: (
    entity: string,
    type: string,
    translationNamespace: string,
    dataName?: string
  ) => void;
  handleSuccessMessage: (message: string) => void;
  handleErrorMessage: (message: string) => void;
  closeErrorDialog: () => void;
  dialogErrorState: DialogErrorState;
}

const NotificationServiceContext = createContext({} as INotificationService);

export const NotificationServiceProvider: React.FC<{
  children?: React.ReactNode;
  handleApiErrorMessage?: any;
  handleApiSuccessMessage?: any;
  handleSuccessMessage?: any;
  handleErrorMessage?: any;
  dialogErrorState?: any;
  closeErrorDialog?: any;
}> = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [dialogErrorState, setDialogErrorState] = useState<DialogErrorState>();

  const closeErrorDialog = () => {
    setDialogErrorState(undefined);
  };

  const handleApiErrorMessage = (
    result: HttpResponseMessageV12Dto,
    translationNamespace: string
  ) => {
    if (result.messageCode && result.messageCode === MissingPermissionCode) {
      enqueueSnackbar(
        i18next
          .t("common:you-do-not-have-the-permission-to-complete-the-action")
          .toString(),
        {
          variant: "error",
        }
      );
      return;
    }
    if (
      result.messageCode &&
      result.messageCode === RequestedEntityNotFoundCode
    ) {
      var entity = "";
      var identifier = "";
      if (result.responseMessageAttributes) {
        entity = i18next.t(
          result.responseMessageAttributes.find(
            (a: { key: string }) => a.key === "EntityName"
          )?.value ?? "",
          { ns: translationNamespace }
        );
        identifier =
          result.responseMessageAttributes.find(
            (a: { key: string }) => a.key === "Identifier"
          )?.value ?? "";
      }
      enqueueSnackbar(
        i18next
          .t("common:requested-entity-not-found", {
            entity,
            identifier,
          })
          .toString(),
        {
          variant: "error",
        }
      );
      return;
    }

    if (result && result.subMessages && result.subMessages.length >= 1) {
      setDialogErrorState({
        result,
        translationNamespace: translationNamespace,
      });
    } else {
      if (result.message) {
        enqueueSnackbar(
          i18next.t(result.message, { ns: translationNamespace }).toString(),
          {
            variant: "error",
          }
        );
      }

      if (
        result.responseMessageAttributes &&
        result.responseMessageAttributes.length > 0
      ) {
        result?.responseMessageAttributes?.forEach((message: any) => {
          let validationResult: ValidationResult = tryParse(message.value);
          if (typeof validationResult === "object") {
            if (
              validationResult.arguments === null ||
              validationResult.arguments === undefined
            ) {
              validationResult.arguments = [];
            }

            let formattedMessage = format(
              i18next.t(validationResult.errorCode, {
                ns: "validationResult",
              }),
              ...validationResult.arguments?.map((arg: any) =>
                i18next.t(arg, { ns: translationNamespace })
              )
            );
            enqueueSnackbar(formattedMessage, {
              variant: "error",
            });
          }
        });
      } else if (
        result.message &&
        result.message === "The given key was not present in the dictionary."
      ) {
        enqueueSnackbar(
          i18next
            .t("common:you-do-not-have-the-permission-to-complete-the-action")
            .toString(),
          {
            variant: "error",
          }
        );
      } else {
        enqueueSnackbar(i18next.t("common:request-failed").toString(), {
          variant: "error",
        });
      }
    }
  };

  const handleApiSuccessMessage = (
    entity: string,
    type: string,
    translationNamespace: string,
    dataName?: string
  ) => {
    let message =
      dataName && dataName.length > 0
        ? format(
            i18next
              .t(`${entity}-0-${type}-successfully`, {
                ns: translationNamespace,
              })
              .toString(),
            dataName
          )
        : i18next
            .t(`${entity}-${type}-successfully`, { ns: translationNamespace })
            .toString();

    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  const handleSuccessMessage = (message: string) => {
    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  const handleErrorMessage = (message: string) => {
    enqueueSnackbar(message, {
      variant: "error",
    });
  };

  const value = {
    handleApiErrorMessage: props.handleApiErrorMessage || handleApiErrorMessage,
    handleApiSuccessMessage:
      props.handleApiSuccessMessage || handleApiSuccessMessage,
    handleSuccessMessage: props.handleSuccessMessage || handleSuccessMessage,
    handleErrorMessage: props.handleErrorMessage || handleErrorMessage,
    dialogErrorState: props.dialogErrorState || dialogErrorState,
    closeErrorDialog: props.closeErrorDialog || closeErrorDialog,
  };

  return (
    <NotificationServiceContext.Provider value={value}>
      {props.children}
      <ErrorDialog />
    </NotificationServiceContext.Provider>
  );
};

export const useNotificationService = () => {
  return useContext(NotificationServiceContext);
};
