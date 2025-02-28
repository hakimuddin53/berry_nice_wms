import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockTransferDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetails/stockTransferDetailsDto";
import { StockTransferSearchDto } from "interfaces/v12/stockTransfer/stockTransferSearch/stockTransferSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStockTransferService } from "services/StockTransferService";
import { useStockTransferTable } from "./datatables/useStockTransferTable";

function StockTransferListPage() {
  const { t } = useTranslation();

  const [stockTransferTable] = useStockTransferTable();
  const StockTransferService = useStockTransferService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockTransferSearchDto = {
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
    return StockTransferService.searchStockTransfers(searchOptions)
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
    return StockTransferService.countStockTransfers(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockTransferDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-transfer")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-transfer") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-stock-transfer"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("stock-transfer")}
        tableKey="StockTransferListPage-Inbound Deliveries"
        headerCells={stockTransferTable}
        data={tableProps}
        dataKey="stockTransferId"
        showSearch={true}
      />
    </Page>
  );
}

export default StockTransferListPage;
