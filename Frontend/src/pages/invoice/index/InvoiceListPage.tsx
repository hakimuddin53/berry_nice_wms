import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { InvoiceSearchDto } from "interfaces/v12/invoice/invoiceSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInvoiceService } from "services/InvoiceService";
import { useCustomerService } from "services/CustomerService";
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
  const customerService = useCustomerService();
  const [invoiceTable] = useInvoiceTable();

  const loadData = async (
    page: number,
    pageSize: number,
    searchValue: string
  ) => {
    const searchOptions = mapSearchOptions(page, pageSize, searchValue);
    const result = await invoiceService.searchInvoices(searchOptions);
    const rows = (result?.data ?? []) as InvoiceDetailsDto[];

    const missingCustomerIds = Array.from(
      new Set(
        rows
          .filter((row) => !row.customerName && row.customerId)
          .map((row) => row.customerId as unknown as string)
      )
    );

    if (missingCustomerIds.length === 0) {
      return rows;
    }

    try {
      const response = await customerService.getByParameters(
        missingCustomerIds as any,
        1,
        missingCustomerIds.length
      );
      const map = Object.fromEntries(
        (response?.data ?? []).map((c: any) => [
          c.id as unknown as string,
          c.name ?? c.customerName ?? c.companyName ?? c.contactName,
        ])
      );
      return rows.map((row) =>
        row.customerName || !row.customerId
          ? row
          : { ...row, customerName: map[row.customerId as unknown as string] }
      );
    } catch {
      return rows;
    }
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
      hasSingleActionButton
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
