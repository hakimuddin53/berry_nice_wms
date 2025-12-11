import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockRecieveDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveDetailsDto";
import { StockRecieveSearchDto } from "interfaces/v12/StockRecieve/StockRecieveSearch/StockRecieveSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStockRecieveService } from "services/StockRecieveService";
import { useStockRecieveTable } from "./datatables/useStockRecieveTable";

function StockRecieveListPage() {
  const { t } = useTranslation("common");

  const [StockRecieveTable] = useStockRecieveTable();
  const StockRecieveService = useStockRecieveService();
  const navigate = useNavigate();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockRecieveSearchDto = {
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
    return StockRecieveService.searchStockRecieves(searchOptions)
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
    return StockRecieveService.countStockRecieves(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockRecieveDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-receive")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-receive") },
      ]}
      actions={[{ title: t("new-stock-receive"), icon: "Add", to: "new" }]}
      hasSingleActionButton
    >
      <DataTable
        title={t("stock-receive")}
        tableKey="StockRecieveListPage"
        headerCells={StockRecieveTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default StockRecieveListPage;
