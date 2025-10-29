import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockInDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInDetailsDto";
import { StockInSearchDto } from "interfaces/v12/stockIn/stockInSearch/stockInSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStockInService } from "services/StockInService";
import { useStockInTable } from "./datatables/useStockInTable";

function StockInListPage() {
  const { t } = useTranslation("common");

  const [stockInTable] = useStockInTable();
  const stockInService = useStockInService();
  const navigate = useNavigate();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockInSearchDto = {
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
    return stockInService
      .searchStockIns(searchOptions)
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
    return stockInService
      .countStockIns(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockInDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-in")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-in") },
      ]}
      actions={[{ title: t("new-stock-in"), icon: "Add", to: "new" }]}
      hasSingleActionButton
    >
      <DataTable
        title={t("stock-in")}
        tableKey="StockInListPage"
        headerCells={stockInTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default StockInListPage;
