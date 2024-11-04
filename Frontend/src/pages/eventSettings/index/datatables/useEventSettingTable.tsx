import { Chip, Link, Typography } from "@mui/material";

import UserDateTime from "components/platbricks/shared/UserDateTime";
import { EventSettingDetailsV12Dto } from "interfaces/v12/eventSetting/eventSettingDetails/eventSettingDetailsV12Dto";
import { _EventSettingSortV12Dto } from "interfaces/v12/eventSetting/eventSettingSearch/eventSettingSearchV12Dto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SortableDataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

const emailRenderer = (email?: string) => {
  const emails = email ? email.split(";") : [];
  const chips = (
    <>
      {emails.slice(0, 3).map((label: string, index: number) => (
        <Chip
          key={index}
          label={label}
          sx={{ mr: 1 }}
          style={{ height: "auto" }}
          size="small"
          color="default"
        />
      ))}
      {emails.length > 3 ? `+${emails.length - 3}` : ""}
    </>
  );
  return chips;
};

export const useEventSettingTable = () => {
  const { t } = useTranslation("eventSetting");

  const eventSettingData = useMemo<
    SortableDataTableHeaderCell<
      EventSettingDetailsV12Dto,
      _EventSettingSortV12Dto
    >[]
  >(
    () => [
      {
        id: "id",
        label: t("common:id"),
        hidden,
      },
      {
        id: "event",
        label: t("event"),
        render: (row) => (
          <Link component={NavLink} to={row.id}>
            <Typography sx={{ wordBreak: "break-word" }}>
              {t(row.event, { ns: "enumerables" })}
            </Typography>
          </Link>
        ),
      },

      {
        id: "sequence",
        label: t("common:sequence"),
        sortable: true,
        sortField: "sequence",
      },
      {
        id: "actionType",
        label: t("action"),
      },
      {
        id: "businessLogic",
        label: t("business-logic"),
        render: (row) => (
          <Typography sx={{ wordBreak: "break-word" }}>
            {row.businessLogic}
          </Typography>
        ),
      },
      {
        id: "callbackUrl",
        label: t("callback-url"),
        render: (row) => (
          <Typography sx={{ wordBreak: "break-word" }}>
            {row.callbackUrl}
          </Typography>
        ),
      },
      {
        id: "parameter1",
        label: t("parameter-1"),
        hidden,
      },
      {
        id: "email",
        label: t("common:email"),
        hidden,
        render: (row) => emailRenderer(row.email),
      },
      {
        id: "emailLanguage",
        label: t("email-language"),
        hidden,
      },
      {
        id: "createdAt",
        label: t("common:created-at"),
        sortable: true,
        sortField: "createdAt",
        hidden,
        render: (row) => <UserDateTime date={row.createdAt} />,
      },
    ],
    [t]
  );

  return [eventSettingData];
};
