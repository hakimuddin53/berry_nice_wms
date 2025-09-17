import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { ExpenseDetailsDto } from "interfaces/v12/expense/expenseDetails/expenseDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useExpenseTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const expenseData = useMemo<DataTableHeaderCell<ExpenseDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("expense-id"),
        hidden,
      },
      {
        id: "description",
        label: t("description"),
        render: (row) => (
          <EasyCopy clipboard={row.description}>
            <Link component={NavLink} to={`/expense/${row.id}`}>
              {row.description || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "amount",
        label: t("amount"),
      },
      {
        id: "category",
        label: t("category"),
      },
      {
        id: "remark",
        label: t("remark"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(expenseData);
  return [expenseData];
};
