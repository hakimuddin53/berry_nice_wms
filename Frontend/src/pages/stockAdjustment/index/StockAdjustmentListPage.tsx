import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockAdjustmentDetailsDto } from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import { StockAdjustmentSearchDto } from "interfaces/v12/stockAdjustment/stockAdjustmentSearch/stockAdjustmentSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStockAdjustmentService } from "services/StockAdjustmentService";
import { useStockAdjustmentTable } from "./datatables/useStockAdjustmentTable";

function StockAdjustmentListPage() {
  const { t } = useTranslation();

  const [stockAdjustmentTable] = useStockAdjustmentTable();
  const StockAdjustmentService = useStockAdjustmentService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockAdjustmentSearchDto = {
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
    return StockAdjustmentService.searchStockAdjustments(searchOptions)
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
    return StockAdjustmentService.countStockAdjustments(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockAdjustmentDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-adjustment")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-adjustment") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-stock-adjustment"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("stock-adjustment")}
        tableKey="StockAdjustmentListPage-Inbound Deliveries"
        headerCells={stockAdjustmentTable}
        data={tableProps}
        dataKey="stockAdjustmentId"
        showSearch={true}
      />
    </Page>
  );
}

export default StockAdjustmentListPage;
