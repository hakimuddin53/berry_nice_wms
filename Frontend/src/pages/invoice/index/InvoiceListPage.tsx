import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useUserDateTime } from "hooks/useUserDateTime";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { InvoiceSearchDto } from "interfaces/v12/invoice/invoiceSearchDto";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerService } from "services/CustomerService";
import { useInvoiceService } from "services/InvoiceService";
import { useProductService } from "services/ProductService";
import { buildInvoicePrintHtml } from "../printInvoice";
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
  const productService = useProductService();
  const { getLocalDate } = useUserDateTime();
  const handlePrint = useCallback(
    async (row: InvoiceDetailsDto) => {
      const printWindow = window.open("", "_blank", "width=900,height=650");
      if (!printWindow) return;
      printWindow.document.write("<p>Loading invoice...</p>");

      try {
        const invoice = await invoiceService.getInvoiceById(
          row.id as unknown as string
        );

        let resolvedCustomerName =
          invoice.customerName ??
          row.customerName ??
          (invoice.customerId as unknown as string) ??
          "-";
        let customerAddress = "";
        let customerPhone = "";

        if (invoice.customerId) {
          try {
            const customer = await customerService.getCustomerById(
              invoice.customerId
            );
            const customerLabel =
              customer?.name ??
              (customer as any)?.customerName ??
              (customer as any)?.companyName ??
              (customer as any)?.contactName ??
              String(invoice.customerId);
            if (!invoice.customerName && !row.customerName) {
              resolvedCustomerName = customerLabel;
            }
            customerAddress = customer?.address ?? "";
            customerPhone = customer?.phone ?? "";
          } catch {
            // ignore customer lookup failures
          }
        }

        const missingProductIds = Array.from(
          new Set(
            invoice.invoiceItems
              .filter(
                (item) =>
                  item.productId &&
                  !item.productCode &&
                  !item.productName &&
                  !item.model &&
                  !item.brand
              )
              .map((item) => item.productId as unknown as string)
          )
        );

        const productLabels: Record<string, string> = {};
        if (missingProductIds.length > 0) {
          const results = await Promise.all(
            missingProductIds.map(async (productId) => {
              try {
                const details = await productService.getProductById(productId);
                const label =
                  (details as any)?.productName ||
                  details.productCode ||
                  details.model ||
                  details.brand ||
                  productId;
                return [productId, label] as const;
              } catch {
                return [productId, productId] as const;
              }
            })
          );

          results.forEach(([productId, label]) => {
            productLabels[productId] = label;
          });
        }

        const html = buildInvoicePrintHtml(invoice, {
          customerName: resolvedCustomerName,
          customerAddress,
          customerPhone,
          productLabels,
          getLocalDate,
        });

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
      } catch (err) {
        printWindow.document.open();
        printWindow.document.write("<p>Unable to load invoice.</p>");
        printWindow.document.close();
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Failed to print invoice", err);
        }
      }
    },
    [customerService, getLocalDate, invoiceService, productService]
  );
  const [invoiceTable] = useInvoiceTable(handlePrint);

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
