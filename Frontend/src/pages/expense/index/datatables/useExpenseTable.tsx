import { Link } from "@mui/material";
import { useLookupSelectOptionsFetcher } from "hooks/queries/useLookupQueries";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { ExpenseDetailsDto } from "interfaces/v12/expense/expenseDetails/expenseDetailsDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;
const PAGE_SIZE = 50;

export const useExpenseTable = () => {
  const { t } = useTranslation();
  const fetchLookupOptions = useLookupSelectOptionsFetcher();
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(
    {}
  );

  const loadCategories = useCallback(async () => {
    let page = 1;
    const labels: Record<string, string> = {};
    try {
      while (true) {
        const chunk =
          (await fetchLookupOptions(
            LookupGroupKey.ExpenseCategory,
            "",
            page,
            PAGE_SIZE
          )) ?? [];
        chunk.forEach((opt) => {
          if (opt.value) {
            labels[opt.value] = opt.label ?? opt.value;
          }
        });
        if (chunk.length < PAGE_SIZE) {
          break;
        }
        page += 1;
      }
    } catch {
      // ignore and fallback to ids
    }
    return labels;
  }, [fetchLookupOptions]);

  useEffect(() => {
    let active = true;
    (async () => {
      const labels = await loadCategories();
      if (active) {
        setCategoryLabels(labels);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadCategories]);

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
        render: (row) => categoryLabels[row.category] ?? row.category ?? "-",
      },
      {
        id: "remark",
        label: t("remark"),
      },
    ],
    [categoryLabels, t]
  );
  /* eslint-enable */
  useCreatedChangeDate(expenseData);
  return [expenseData];
};
