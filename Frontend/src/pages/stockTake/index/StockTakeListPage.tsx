import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { StockTakeDetailsDto } from "interfaces/v12/stockTake/stockTakeDetailsDto";
import { StockTakeSearchDto } from "interfaces/v12/stockTake/stockTakeSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStockTakeService } from "services/StockTakeService";
import { useStockTakeTable } from "./datatables/useStockTakeTable";

const StockTakeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stockTakeService = useStockTakeService();
  const [headerCells] = useStockTakeTable();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string
  ): StockTakeSearchDto => ({
    search: searchValue,
    page: page + 1,
    pageSize,
  });

  const loadData = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(page, pageSize, searchValue);
    return stockTakeService
      .search(searchOptions)
      .then((res) => res.data)
      .catch(() => []);
  };

  const loadDataCount = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(page, pageSize, searchValue);
    return stockTakeService.count(searchOptions).catch(() => 0);
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockTakeDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-take", { defaultValue: "Stock Take" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-take", { defaultValue: "Stock Take" }) },
      ]}
      hasSingleActionButton
      actions={[
        {
          title: t("new-stock-take", { defaultValue: "New Stock Take" }),
          icon: "Add",
          onclick: () => navigate("new"),
        },
      ]}
    >
      <DataTable
        title={t("stock-take", { defaultValue: "Stock Take" })}
        tableKey="StockTakeListPage"
        headerCells={headerCells}
        data={tableProps}
        dataKey="id"
        showSearch
      />
    </Page>
  );
};

export default StockTakeListPage;
