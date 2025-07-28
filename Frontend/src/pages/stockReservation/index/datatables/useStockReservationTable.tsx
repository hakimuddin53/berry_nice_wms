import { CancelOutlined } from "@mui/icons-material";
import { Chip, IconButton, Link } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { StockReservationDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import { CheckCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useStockReservationService } from "services/StockReservationService";
import { getReservationStatusName } from "utils/helper";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";
import { getChipColor } from "../../../../constants";

export const useStockReservationTable = () => {
  const { t } = useTranslation();

  const stockReservationService = useStockReservationService();

  /* eslint-disable react-hooks/exhaustive-deps */
  const stockReservationData = useMemo<
    DataTableHeaderCell<StockReservationDetailsDto>[]
  >(
    () => [
      {
        id: "id",
        label: t("stock-reservation-id"),
      },
      {
        id: "number",
        label: t("common:number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stock-reservation/${row.id}`}>
              {row.number || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "warehouseId",
        label: t("warehouse"),
        render: (row) => row.warehouseId || "N/A",
      },
      {
        id: "reservedAt",
        label: t("reserved-at"),
        render: (row) =>
          row.reservedAt ? new Date(row.reservedAt).toLocaleString() : "N/A",
      },
      {
        id: "expiresAt",
        label: t("expires-at"),
        render: (row) =>
          row.expiresAt ? new Date(row.expiresAt).toLocaleString() : "N/A",
      },
      {
        id: "status",
        label: t("status"),
        render: (row) => {
          return (
            <Chip
              label={getReservationStatusName(row.status)}
              color={getChipColor(row.status)}
            />
          );
        },
      },
      {
        id: "cancellationRemark",
        label: t("cancellation-remark"),
        render: (row) => row.cancellationRemark || "-",
      },
      {
        id: "cancellationRequestedBy",
        label: t("cancellation-requested-by"),
        render: (row) => row.cancellationRequestedBy || "-",
      },
      {
        id: "cancellationRequestedAt",
        label: t("cancellation-requested-at"),
        render: (row) =>
          row.cancellationRequestedAt
            ? new Date(row.cancellationRequestedAt).toLocaleString()
            : "-",
      },
      {
        id: "cancellationApprovedBy",
        label: t("cancellation-approved-by"),
        render: (row) => row.cancellationApprovedBy || "-",
      },
      {
        id: "cancellationApprovedAt",
        label: t("cancellation-approved-at"),
        render: (row) =>
          row.cancellationApprovedAt
            ? new Date(row.cancellationApprovedAt).toLocaleString()
            : "-",
      },
      {
        id: "cancelRequest",
        label: "",
        render: (row) => {
          if (row.status === ReservationStatusEnum.ACTIVE) {
            return (
              <IconButton
                size="small"
                onClick={() => {
                  stockReservationService.requestCancelStockReservation(row.id);
                }}
              >
                <CancelOutlined color="error" />
              </IconButton>
            );
          }
          return "";
        },
      },
      {
        id: "cancelApprove",
        label: "",
        render: (row) => {
          if (row.status === ReservationStatusEnum.CANCELREQUESTED) {
            return (
              <IconButton
                size="small"
                onClick={() => {
                  stockReservationService.approveCancelStockReservation(row.id);
                }}
              >
                <CheckCircleIcon color="primary" />
              </IconButton>
            );
          }
          return "";
        },
      },
      {
        id: "createdAt",
        label: t("common:created-at"),
        render: (row) => <UserDateTime date={row.createdAt} />,
      },
      {
        id: "createdById",
        label: t("common:created-by"),
        render: (row) => <UserName userId={row.createdById} />,
      },
    ],
    [t]
  );

  return [stockReservationData];
};
