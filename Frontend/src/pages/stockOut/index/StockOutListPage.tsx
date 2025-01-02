import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockOutDetailsDto } from "interfaces/v12/stockout/stockOutDetails/stockOutDetailsDto";
import { StockOutSearchDto } from "interfaces/v12/stockout/stockOutSearch/stockOutSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStockOutService } from "services/StockOutService";
import { useStockOutTable } from "./datatables/useStockOutTable";

function StockOutListPage() {
  const { t } = useTranslation();

  const [stockOutTable] = useStockOutTable();
  const StockOutService = useStockOutService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockOutSearchDto = {
      search: searchValue,
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
    return StockOutService.searchStockOuts(searchOptions)
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
    return StockOutService.countStockOuts(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockOutDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-out")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-out") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-stock-out"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("stock-out")}
        tableKey="StockOutListPage-Inbound Deliveries"
        headerCells={stockOutTable}
        data={tableProps}
        dataKey="stockOutId"
        showSearch={true}
      />
    </Page>
  );
}

export default StockOutListPage;
