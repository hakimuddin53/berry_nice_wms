import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { SupplierDetailsDto } from "interfaces/v12/supplier/supplierDetails/supplierDetailsDto";
import { SupplierSearchDto } from "interfaces/v12/supplier/supplierSearch/supplierSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSupplierService } from "services/SupplierService";
import { useSupplierTable } from "./datatables/useSupplierTable";

function SupplierListPage() {
  const { t } = useTranslation();

  const [supplierTable] = useSupplierTable();
  const SupplierService = useSupplierService();
  const navigate = useNavigate();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: SupplierSearchDto = {
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
    return SupplierService.searchSuppliers(searchOptions)
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
    return SupplierService.countSuppliers(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as SupplierDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("supplier")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("supplier") },
      ]}
      actions={[{ title: t("new-supplier"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("supplier")}
        tableKey="SupplierListPage"
        headerCells={supplierTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default SupplierListPage;
