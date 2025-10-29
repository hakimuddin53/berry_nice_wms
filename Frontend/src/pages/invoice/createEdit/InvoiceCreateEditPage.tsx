import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { Page, PageSection, PbCard } from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import SelectAsync2, {
  SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync2";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { InvoiceCreateUpdateDto } from "interfaces/v12/invoice/invoiceCreateUpdateDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
import { useInvoiceService } from "services/InvoiceService";
import { useNotificationService } from "services/NotificationService";
import { useUserService } from "services/UserService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  invoiceCreateEditSchema,
  YupInvoiceCreateEdit,
  YupInvoiceItemCreateEdit,
} from "./yup/invoiceCreateEditSchema";

const createEmptyItem = (): YupInvoiceItemCreateEdit => ({
  id: undefined,
  productId: EMPTY_GUID as guid,
  productCode: "",
  description: "",
  primarySerialNumber: "",
  manufactureSerialNumber: "",
  imei: "",
  warrantyDurationMonths: 0,
  unitOfMeasure: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  status: "",
});

const formatDateInput = (value?: string) =>
  value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);

const mapDetailsToForm = (details: any): YupInvoiceCreateEdit => ({
  customerId: details.customerId ?? undefined,
  customerName: details.customerName ?? "",
  dateOfSale: formatDateInput(details.dateOfSale),
  salesPersonId: details.salesPersonId ?? "",
  eOrderNumber: details.eOrderNumber ?? "",
  salesTypeId: details.salesTypeId ?? undefined,
  paymentTypeId: details.paymentTypeId ?? undefined,
  paymentReference: details.paymentReference ?? "",
  remark: details.remark ?? "",
  invoiceItems: (details.invoiceItems ?? []).map((item: any) => ({
    id: item.id,
    productId: item.productId ?? undefined,
    productCode: item.productCode ?? "",
    description: item.description ?? "",
    primarySerialNumber: item.primarySerialNumber ?? "",
    manufactureSerialNumber: item.manufactureSerialNumber ?? "",
    imei: item.imei ?? "",
    warrantyDurationMonths: item.warrantyDurationMonths ?? 0,
    unitOfMeasure: item.unitOfMeasure ?? "",
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? 0,
    totalPrice: item.totalPrice ?? 0,
    status: item.status ?? "",
  })),
});

const InvoiceCreateEditPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const invoiceService = useInvoiceService();
  const customerService = useCustomerService();
  const userService = useUserService();
  const notificationService = useNotificationService();
  const [initialValues, setInitialValues] = useState<YupInvoiceCreateEdit>({
    customerId: undefined,
    customerName: "",
    dateOfSale: formatDateInput(),
    salesPersonId: "",
    eOrderNumber: "",
    salesTypeId: undefined,
    paymentTypeId: undefined,
    paymentReference: "",
    remark: "",
    invoiceItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setInitialValues((current) => ({
        ...current,
        invoiceItems: current.invoiceItems.length
          ? current.invoiceItems
          : [createEmptyItem()],
      }));
      setLoading(false);
      return;
    }

    invoiceService
      .getInvoiceById(id)
      .then((invoice) => {
        const formValue = mapDetailsToForm(invoice);
        if (formValue.invoiceItems.length === 0) {
          formValue.invoiceItems = [createEmptyItem()];
        }
        setInitialValues(formValue);
      })
      .catch((err) => {
        notificationService.handleApiErrorMessage(err.data, "common");
        navigate("/invoice");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formik = useFormik<YupInvoiceCreateEdit>({
    initialValues,
    enableReinitialize: true,
    validationSchema: invoiceCreateEditSchema,
    onSubmit: async (values, helpers) => {
      const payload: InvoiceCreateUpdateDto = {
        customerId: values.customerId || undefined,
        customerName: values.customerName || undefined,
        dateOfSale: values.dateOfSale,
        salesPersonId: values.salesPersonId,
        eOrderNumber: values.eOrderNumber || undefined,
        salesTypeId: values.salesTypeId || undefined,
        paymentTypeId: values.paymentTypeId || undefined,
        paymentReference: values.paymentReference || undefined,
        remark: values.remark || undefined,
        invoiceItems: values.invoiceItems.map((item) => ({
          id: item.id,
          productId: item.productId || undefined,
          productCode: item.productCode || undefined,
          description: item.description || undefined,
          primarySerialNumber: item.primarySerialNumber || undefined,
          manufactureSerialNumber: item.manufactureSerialNumber || undefined,
          imei: item.imei || undefined,
          warrantyDurationMonths: item.warrantyDurationMonths || 0,
          unitOfMeasure: item.unitOfMeasure || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice ?? item.unitPrice * item.quantity,
          status: item.status || undefined,
        })),
      };

      try {
        if (id) {
          await invoiceService.updateInvoice(id, payload);
          notificationService.handleApiSuccessMessage(
            "invoice",
            "updated",
            "common"
          );
          navigate(`/invoice/${id}`);
        } else {
          const created = await invoiceService.createInvoice(payload);
          notificationService.handleApiSuccessMessage(
            "invoice",
            "created",
            "common"
          );
          navigate(`/invoice/${created.id}`);
        }
      } catch (error: any) {
        notificationService.handleApiErrorMessage(error.data, "common");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.values.invoiceItems.forEach((item, index) => {
      const computed = Number(item.unitPrice || 0) * Number(item.quantity || 0);
      if (computed !== (item.totalPrice ?? 0)) {
        formik.setFieldValue(
          `invoiceItems[${index}].totalPrice`,
          computed,
          false
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.invoiceItems
      .map((item) => `${item.unitPrice}-${item.quantity}`)
      .join("|"),
  ]);

  const pageTitle = id ? t("edit-invoice") : t("create-invoice");

  const customerIds = useMemo(
    () =>
      formik.values.customerId
        ? [formik.values.customerId as unknown as string]
        : [],
    [formik.values.customerId]
  );

  const salesPersonIds = useMemo(
    () => (formik.values.salesPersonId ? [formik.values.salesPersonId] : []),
    [formik.values.salesPersonId]
  );

  const getItemError = (
    index: number,
    field: keyof YupInvoiceItemCreateEdit
  ): string | undefined => {
    const errors = formik.errors.invoiceItems;
    if (!Array.isArray(errors)) {
      return typeof errors === "string" ? errors : undefined;
    }

    const itemError = errors[index];
    if (!itemError || typeof itemError === "string") {
      return itemError ?? undefined;
    }

    const fieldError = itemError[field];
    return typeof fieldError === "string" ? fieldError : undefined;
  };

  const getItemTouched = (
    index: number,
    field: keyof YupInvoiceItemCreateEdit
  ): boolean => Boolean(formik.touched.invoiceItems?.[index]?.[field]);

  if (loading) {
    return null;
  }

  const handleSelectChange = (
    field: string,
    option?: SelectAsyncOption | SelectAsyncOption[]
  ) => {
    if (Array.isArray(option)) {
      return;
    }
    formik.setFieldValue(field, option?.value ?? "");
  };

  return (
    <Page title={pageTitle}>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={3}>
            <PageSection title={t("invoice")}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SelectAsync2
                    name="customerId"
                    label={t("customer")}
                    placeholder={t("customer")}
                    readOnly
                    suggestionsIfEmpty
                    error={
                      formik.touched.customerId &&
                      Boolean(formik.errors.customerId)
                    }
                    onBlur={() => formik.setFieldTouched("customerId")}
                    ids={customerIds}
                    asyncFunc={(
                      input: string,
                      page: number,
                      pageSize: number,
                      ids?: string[]
                    ) =>
                      customerService.getSelectOptions(
                        input,
                        page,
                        pageSize,
                        ids
                      )
                    }
                    onSelectionChange={(option) => {
                      formik.setFieldValue(
                        "customerId",
                        option?.value ?? undefined
                      );
                      formik.setFieldValue("customerName", option?.label ?? "");
                    }}
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.customerId}
                        error={formik.errors.customerId}
                        translatedFieldName={t("customer")}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="customerName"
                    name="customerName"
                    label={t("customer") + " (" + t("name") + ")"}
                    value={formik.values.customerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="dateOfSale"
                    name="dateOfSale"
                    type="date"
                    label={t("date-of-sale")}
                    value={formik.values.dateOfSale}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                    error={
                      formik.touched.dateOfSale &&
                      Boolean(formik.errors.dateOfSale)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.dateOfSale}
                        error={formik.errors.dateOfSale}
                        translatedFieldName={t("date-of-sale")}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SelectAsync2
                    name="salesPersonId"
                    label={t("sales-person")}
                    readOnly
                    suggestionsIfEmpty
                    error={
                      formik.touched.salesPersonId &&
                      Boolean(formik.errors.salesPersonId)
                    }
                    onBlur={() => formik.setFieldTouched("salesPersonId")}
                    ids={salesPersonIds}
                    asyncFunc={(
                      input: string,
                      page: number,
                      pageSize: number,
                      ids?: string[]
                    ) => userService.getSelectOptions(input, page, pageSize)}
                    onSelectionChange={(option) =>
                      handleSelectChange("salesPersonId", option)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.salesPersonId}
                        error={formik.errors.salesPersonId}
                        translatedFieldName={t("sales-person")}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="eOrderNumber"
                    name="eOrderNumber"
                    label={t("e-order-number")}
                    value={formik.values.eOrderNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LookupAutocomplete
                    groupKey={LookupGroupKey.SalesType}
                    name="salesTypeId"
                    label={t("sales-type")}
                    value={formik.values.salesTypeId ?? ""}
                    onChange={(newValue) =>
                      formik.setFieldValue("salesTypeId", newValue || undefined)
                    }
                    onBlur={() => formik.setFieldTouched("salesTypeId")}
                    error={
                      formik.touched.salesTypeId &&
                      Boolean(formik.errors.salesTypeId)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.salesTypeId}
                        error={formik.errors.salesTypeId}
                        translatedFieldName={t("sales-type")}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LookupAutocomplete
                    groupKey={LookupGroupKey.PaymentType}
                    name="paymentTypeId"
                    label={t("payment-type")}
                    value={formik.values.paymentTypeId ?? ""}
                    onChange={(newValue) =>
                      formik.setFieldValue(
                        "paymentTypeId",
                        newValue || undefined
                      )
                    }
                    onBlur={() => formik.setFieldTouched("paymentTypeId")}
                    error={
                      formik.touched.paymentTypeId &&
                      Boolean(formik.errors.paymentTypeId)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.paymentTypeId}
                        error={formik.errors.paymentTypeId}
                        translatedFieldName={t("payment-type")}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="paymentReference"
                    name="paymentReference"
                    label={t("payment-reference")}
                    value={formik.values.paymentReference ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="remark"
                    name="remark"
                    label={t("remark")}
                    value={formik.values.remark ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>
            </PageSection>

            <PageSection title={t("invoice-items")}>
              <FieldArray name="invoiceItems">
                {({ push, remove }) => (
                  <Stack spacing={2}>
                    {formik.values.invoiceItems.map((item, index) => {
                      const fieldName = (
                        name: keyof YupInvoiceItemCreateEdit
                      ) => `invoiceItems[${index}].${name}`;
                      return (
                        <PbCard key={item.id ?? index}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("productCode")}
                                name={fieldName("productCode")}
                                label={t("product-code")}
                                value={item.productCode ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("description")}
                                name={fieldName("description")}
                                label={t("description")}
                                value={item.description ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("primarySerialNumber")}
                                name={fieldName("primarySerialNumber")}
                                label={t("primary-serial-number")}
                                value={item.primarySerialNumber ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("manufactureSerialNumber")}
                                name={fieldName("manufactureSerialNumber")}
                                label={t("manufacture-serial-number")}
                                value={item.manufactureSerialNumber ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("imei")}
                                name={fieldName("imei")}
                                label={t("imei")}
                                value={item.imei ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                id={fieldName("unitOfMeasure")}
                                name={fieldName("unitOfMeasure")}
                                label={t("uom")}
                                value={item.unitOfMeasure ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                id={fieldName("quantity")}
                                name={fieldName("quantity")}
                                label={t("quantity")}
                                value={item.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  getItemTouched(index, "quantity") &&
                                  Boolean(getItemError(index, "quantity"))
                                }
                                helperText={
                                  <FormikErrorMessage
                                    touched={getItemTouched(index, "quantity")}
                                    error={getItemError(index, "quantity")}
                                    translatedFieldName={t("quantity")}
                                  />
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                id={fieldName("unitPrice")}
                                name={fieldName("unitPrice")}
                                label={t("unit-price-sold")}
                                value={item.unitPrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  getItemTouched(index, "unitPrice") &&
                                  Boolean(getItemError(index, "unitPrice"))
                                }
                                helperText={
                                  <FormikErrorMessage
                                    touched={getItemTouched(index, "unitPrice")}
                                    error={getItemError(index, "unitPrice")}
                                    translatedFieldName={t("unit-price-sold")}
                                  />
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                id={fieldName("totalPrice")}
                                name={fieldName("totalPrice")}
                                label={t("total-price")}
                                value={item.totalPrice ?? 0}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                id={fieldName("warrantyDurationMonths")}
                                name={fieldName("warrantyDurationMonths")}
                                label={t("warranty-duration-months")}
                                value={item.warrantyDurationMonths ?? 0}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                id={fieldName("status")}
                                name={fieldName("status")}
                                label={t("status")}
                                value={item.status ?? ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box display="flex" justifyContent="flex-end">
                                <Button
                                  color="error"
                                  variant="outlined"
                                  onClick={() => remove(index)}
                                  disabled={
                                    formik.values.invoiceItems.length === 1
                                  }
                                >
                                  {t("remove-invoice-item")}
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </PbCard>
                      );
                    })}
                    <Button
                      variant="outlined"
                      onClick={() => push(createEmptyItem())}
                    >
                      {t("add-invoice-item")}
                    </Button>
                  </Stack>
                )}
              </FieldArray>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Typography variant="h6">
                  {t("grand-total")}:{" "}
                  {formik.values.invoiceItems
                    .reduce((sum, item) => sum + (item.totalPrice ?? 0), 0)
                    .toFixed(2)}
                </Typography>
              </Box>
            </PageSection>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {t("save")}
              </Button>
            </Stack>
          </Stack>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default InvoiceCreateEditPage;
