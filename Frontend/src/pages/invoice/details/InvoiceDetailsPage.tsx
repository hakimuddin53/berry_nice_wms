import {
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
} from "components/platbricks/shared";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { CustomerDetailsDto } from "interfaces/v12/customer/customerDetails/customerDetailsDto";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
import { useInvoiceService } from "services/InvoiceService";
import { useProductService } from "services/ProductService";
import {
  calculateWarrantyExpiryDate,
  formatWarrantyExpiry,
  warrantyLabelFromMonths,
} from "utils/warranty";

const InvoiceDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceService = useInvoiceService();
  const productService = useProductService();
  const customerService = useCustomerService();
  const [invoice, setInvoice] = useState<InvoiceDetailsDto | null>(null);
  const [productLabels, setProductLabels] = useState<Record<string, string>>(
    {}
  );
  const [resolvedCustomerName, setResolvedCustomerName] = useState<
    string | null
  >(null);
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetailsDto | null>(null);

  const displayProduct = useCallback(
    (item: any) =>
      item.productCode ||
      item.productName ||
      item.model ||
      item.brand ||
      (item.productId
        ? productLabels[item.productId as unknown as string]
        : undefined) ||
      item.productId ||
      "-",
    [productLabels]
  );

  const loadInvoice = useCallback(() => {
    if (!id) return;
    invoiceService
      .getInvoiceById(id)
      .then((result) => setInvoice(result))
      .catch(() => navigate("/invoice"));
  }, [id, invoiceService, navigate]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  useEffect(() => {
    let isMounted = true;

    const fetchMissingLabels = async () => {
      if (!invoice) return;

      if (
        invoice.customerName &&
        resolvedCustomerName !== invoice.customerName
      ) {
        setResolvedCustomerName(invoice.customerName);
      }

      if (invoice.customerId && !customerDetails) {
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
          if (isMounted) {
            setCustomerDetails(customer);
            if (!resolvedCustomerName) {
              setResolvedCustomerName(customerLabel);
            }
          }
        } catch {
          if (isMounted && !resolvedCustomerName) {
            setResolvedCustomerName(String(invoice.customerId));
          }
        }
      } else if (customerDetails && !resolvedCustomerName) {
        const fallbackLabel =
          customerDetails.name ??
          (customerDetails as any)?.customerName ??
          (customerDetails as any)?.companyName ??
          (customerDetails as any)?.contactName ??
          "-";
        setResolvedCustomerName(fallbackLabel);
      }

      const missingProductIds = Array.from(
        new Set(
          invoice.invoiceItems
            .filter(
              (item) =>
                item.productId &&
                !productLabels[item.productId as unknown as string] &&
                !item.productCode &&
                !item.productName &&
                !item.model &&
                !item.brand
            )
            .map((item) => item.productId as unknown as string)
        )
      );

      if (missingProductIds.length > 0) {
        try {
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

          if (isMounted) {
            setProductLabels((prev) => ({
              ...prev,
              ...Object.fromEntries(results),
            }));
          }
        } catch {
          // ignore product label failures
        }
      }
    };

    fetchMissingLabels();

    return () => {
      isMounted = false;
    };
  }, [
    customerService,
    customerDetails,
    invoice,
    productLabels,
    productService,
    resolvedCustomerName,
  ]);

  if (!invoice) {
    return <Page title={t("invoice")} />;
  }

  return (
    <Page
      title={t("invoice")}
      breadcrumbs={[
        { label: t("dashboard"), to: "/" },
        { label: t("invoice"), to: "/invoice" },
        { label: invoice.number },
      ]}
      actions={[{ title: t("edit"), icon: "Edit", to: "edit" }]}
      hasSingleActionButton
    >
      <PbCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("invoice-number")}>
                  {invoice.number}
                </KeyValuePair>
                <KeyValuePair label={t("customer")}>
                  {resolvedCustomerName ?? invoice.customerName ?? "-"}
                </KeyValuePair>
                <KeyValuePair label={t("date-of-sale")}>
                  <UserDateTime date={invoice.dateOfSale} />
                </KeyValuePair>
                <KeyValuePair label={t("sales-person")}>
                  {invoice.salesPersonName || invoice.salesPersonId}
                </KeyValuePair>
                <KeyValuePair label={t("warehouse")}>
                  {invoice.warehouseLabel || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("sales-type")}>
                  {invoice.salesTypeName || "-"}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("payment-type")}>
                  {invoice.paymentTypeName || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("payment-reference")}>
                  {invoice.paymentReference || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("remark")}>
                  {invoice.remark || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("grand-total")}>
                  {invoice.grandTotal.toFixed(2)}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
          </Grid>
        </CardContent>
      </PbCard>

      <PbCard sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("invoice-items")}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("product")}</TableCell>
                <TableCell align="right">{t("unit-price-sold")}</TableCell>
                <TableCell align="right">
                  {t("warranty-duration-months")}
                </TableCell>
                <TableCell align="right">
                  {t("warranty", { defaultValue: "Warranty" }) +
                    " " +
                    t("expired", { defaultValue: "Expired" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.invoiceItems.map((item) => {
                const expiryIso =
                  item.warrantyExpiryDate ??
                  calculateWarrantyExpiryDate(
                    invoice.dateOfSale,
                    item.warrantyDurationMonths
                  );
                return (
                  <TableRow key={item.id as unknown as string}>
                    <TableCell>{displayProduct(item)}</TableCell>
                    <TableCell align="right">
                      {item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {warrantyLabelFromMonths(item.warrantyDurationMonths)}
                    </TableCell>
                    <TableCell align="right">
                      {formatWarrantyExpiry(expiryIso) || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {invoice.invoiceItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t("no-items-added")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </PbCard>
    </Page>
  );
};

export default InvoiceDetailsPage;
