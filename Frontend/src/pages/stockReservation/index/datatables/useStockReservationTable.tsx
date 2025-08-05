import { CancelOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { Chip, IconButton, Link, Tooltip } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import WarehouseName from "components/platbricks/entities/WarehouseName";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { StockReservationDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import jwtDecode from "jwt-decode";
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
        render: (row) =>
          row.warehouseId ? (
            <WarehouseName warehouseId={row.warehouseId} />
          ) : (
            "N/A"
          ),
      },
      {
        id: "reservedAt",
        label: t("reserved-at"),
        render: (row) =>
          row.reservedAt ? <UserDateTime date={row.reservedAt} /> : "N/A",
      },
      {
        id: "expiresAt",
        label: t("expires-at"),
        render: (row) =>
          row.expiresAt ? <UserDateTime date={row.expiresAt} /> : "N/A",
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
        id: "cancellationRequestedBy",
        label: t("cancellation-requested-by"),
        render: (row) => row.cancellationRequestedBy || "-",
      },
      {
        id: "cancellationRequestedAt",
        label: t("cancellation-requested-at"),
        render: (row) =>
          row.cancellationRequestedAt ? (
            <UserDateTime date={row.cancellationRequestedAt} />
          ) : (
            "-"
          ),
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
          row.cancellationApprovedAt ? (
            <UserDateTime date={row.cancellationApprovedAt} />
          ) : (
            "-"
          ),
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
      {
        id: "action",
        label: "Action",
        render: (row) => {
          const status = getReservationStatusName(row.status);
          const token = window.localStorage.getItem("accessToken") || "";
          const decoded = token
            ? jwtDecode<{ sub: string; Role: string }>(token)
            : null;
          const userEmail = decoded?.sub ?? "";
          const userRole = decoded?.Role ?? "";

          if (status === ReservationStatusEnum.ACTIVE) {
            return (
              <Tooltip title="Request cancellation">
                <IconButton
                  size="small"
                  onClick={() =>
                    stockReservationService
                      .requestCancelStockReservation(row.id, userEmail)
                      .then((result) => {
                        // reload the current page
                        window.location.reload();
                      })
                  }
                >
                  <CancelOutlined color="error" />
                </IconButton>
              </Tooltip>
            );
          }

          if (
            status === ReservationStatusEnum.CANCELREQUESTED &&
            userRole === "admin"
          ) {
            return (
              <Tooltip title="Approve cancellation">
                <IconButton
                  size="small"
                  onClick={() =>
                    stockReservationService
                      .approveCancelStockReservation(row.id, userEmail)
                      .then(() => {
                        // reload the current page
                        window.location.reload();
                      })
                  }
                >
                  <CheckCircleOutlined color="primary" />
                </IconButton>
              </Tooltip>
            );
          }

          return "";
        },
      },
    ],
    [t]
  );

  return [stockReservationData];
};
