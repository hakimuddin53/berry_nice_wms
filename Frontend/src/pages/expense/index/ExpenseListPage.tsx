import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { ExpenseDetailsDto } from "interfaces/v12/expense/expenseDetails/expenseDetailsDto";
import { ExpenseSearchDto } from "interfaces/v12/expense/expenseSearch/expenseSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useExpenseService } from "services/ExpenseService";
import { useExpenseTable } from "./datatables/useExpenseTable";

function ExpenseListPage() {
  const { t } = useTranslation();

  const [expenseTable] = useExpenseTable();
  const ExpenseService = useExpenseService();
  const navigate = useNavigate();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: ExpenseSearchDto = {
      search: searchValue,
      page: page + 1,
      pageSize,
    };

    return searchOptions;
  };

  const loadData = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return ExpenseService.searchExpenses(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  };

  const loadDataCount = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return ExpenseService.countExpenses(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as ExpenseDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("expense")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("expense") },
      ]}
      actions={[{ title: t("new-expense"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("expense")}
        tableKey="ExpenseListPage"
        headerCells={expenseTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default ExpenseListPage;
