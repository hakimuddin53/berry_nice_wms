import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { CustomerDetailsDto } from "interfaces/v12/customer/customerDetails/customerDetailsDto";
import { CustomerSearchDto } from "interfaces/v12/customer/customerSearch/customerSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
import { useCustomerTable } from "./datatables/useCustomerTable";

function CustomerListPage() {
  const { t } = useTranslation();

  const [customerTable] = useCustomerTable();
  const CustomerService = useCustomerService();
  const navigate = useNavigate();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: CustomerSearchDto = {
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
    return CustomerService.searchCustomers(searchOptions)
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
    return CustomerService.countCustomers(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as CustomerDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("customer")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("customer") },
      ]}
      actions={[{ title: t("new-customer"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("customer")}
        tableKey="CustomerListPage"
        headerCells={customerTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default CustomerListPage;
