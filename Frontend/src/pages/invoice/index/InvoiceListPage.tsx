import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { InvoiceSearchDto } from "interfaces/v12/invoice/invoiceSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInvoiceService } from "services/InvoiceService";
import { useInvoiceTable } from "./datatables/useInvoiceTable";

const mapSearchOptions = (
  page: number,
  pageSize: number,
  searchValue: string
): InvoiceSearchDto => ({
  search: searchValue,
  page: page + 1,
  pageSize,
});

function InvoiceListPage() {
  const { t } = useTranslation();
  const invoiceService = useInvoiceService();
  const [invoiceTable] = useInvoiceTable();

  const loadData = async (
    page: number,
    pageSize: number,
    searchValue: string
  ) => {
    const searchOptions = mapSearchOptions(page, pageSize, searchValue);
    const result = await invoiceService.searchInvoices(searchOptions);
    return (result?.data ?? []) as InvoiceDetailsDto[];
  };

  const loadDataCount = async (
    page: number,
    pageSize: number,
    searchValue: string
  ) => {
    const searchOptions = mapSearchOptions(page, pageSize, searchValue);
    const result = await invoiceService.countInvoices(searchOptions);
    return result;
  };

  const { tableProps, reloadData } = useDatatableControls<InvoiceDetailsDto>({
    initialData: [],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("invoice")}
      breadcrumbs={[
        { label: t("dashboard"), to: "/" },
        { label: t("invoice") },
      ]}
      actions={[{ title: t("create-invoice"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("invoices")}
        tableKey="InvoiceListPage"
        headerCells={invoiceTable}
        data={tableProps}
        dataKey="id"
        showSearch
      />
    </Page>
  );
}

export default InvoiceListPage;

