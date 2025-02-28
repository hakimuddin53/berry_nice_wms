import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { StockReservationDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import { StockReservationSearchDto } from "interfaces/v12/stockReservation/stockReservationSearch/stockReservationSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStockReservationService } from "services/StockReservationService";
import { useStockReservationTable } from "./datatables/useStockReservationTable";

function StockReservationListPage() {
  const { t } = useTranslation("stockReservation");

  const [stockReservationTable] = useStockReservationTable();
  const StockReservationService = useStockReservationService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockReservationSearchDto = {
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
    return StockReservationService.searchStockReservations(searchOptions)
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
    return StockReservationService.countStockReservations(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockReservationDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-reservation")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-reservation") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-stock-reservation"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("stock-reservation")}
        tableKey="StockReservationListPage-Inbound Deliveries"
        headerCells={stockReservationTable}
        data={tableProps}
        dataKey="stockReservationId"
        showSearch={true}
      />
    </Page>
  );
}

export default StockReservationListPage;
