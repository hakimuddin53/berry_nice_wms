import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { StockTransferDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetailsDto";
import { StockTransferSearchDto } from "interfaces/v12/stockTransfer/stockTransferSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStockTransferService } from "services/StockTransferService";
import { useStockTransferTable } from "./datatables/useStockTransferTable";

const StockTransferListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stockTransferService = useStockTransferService();
  const [headerCells] = useStockTransferTable();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string
  ): StockTransferSearchDto => ({
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
    return stockTransferService
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
    return stockTransferService.count(searchOptions).catch(() => 0);
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
      title={t("stock-transfer", { defaultValue: "Stock Transfer" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-transfer", { defaultValue: "Stock Transfer" }) },
      ]}
      hasSingleActionButton
      actions={[
        {
          title: t("new-transfer", { defaultValue: "New Transfer" }),
          icon: "Add",
          onclick: () => navigate("new"),
        },
      ]}
    >
      <DataTable
        title={t("stock-transfer", { defaultValue: "Stock Transfer" })}
        tableKey="StockTransferListPage"
        headerCells={headerCells}
        data={tableProps}
        dataKey="id"
        showSearch
      />
    </Page>
  );
};

export default StockTransferListPage;
