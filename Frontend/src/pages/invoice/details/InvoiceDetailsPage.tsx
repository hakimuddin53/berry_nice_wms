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
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoiceService } from "services/InvoiceService";
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
  const [invoice, setInvoice] = useState<InvoiceDetailsDto | null>(null);

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
                  {invoice.customerName || "-"}
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
              <TableCell>{t("product-code")}</TableCell>
              <TableCell>
                {t("imei", { defaultValue: "IMEI/Serial Number" })}
              </TableCell>
              <TableCell align="right">{t("quantity")}</TableCell>
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
                  <TableCell>{item.productCode || "-"}</TableCell>
                  <TableCell>{item.imei || "-"}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
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
                  <TableCell colSpan={6}>
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
