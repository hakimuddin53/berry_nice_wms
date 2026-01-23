import { CardContent, Stack, Typography } from "@mui/material";
import {
  BadgeText,
  DataTable,
  NavBlocker,
  Page,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import MessageDialog from "components/platbricks/shared/dialogs/MessageDialog";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useFormikDatatable } from "hooks/useFormikDatatable";
import { InvoiceCreateUpdateDto } from "interfaces/v12/invoice/invoiceCreateUpdateDto";
import jwtDecode from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoiceService } from "services/InvoiceService";
import { useNotificationService } from "services/NotificationService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  extractApiErrorMessages,
  flattenFormikErrors,
} from "utils/errorDialogHelpers";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
} from "utils/formikHelpers";
import { calculateWarrantyExpiryDate } from "utils/warranty";
import { useInvoiceItemTable } from "../datatables/useInvoiceItemTable";
import InvoiceHeadCreateEdit from "./InvoiceHeadCreateEdit";
import InvoiceItemCreateEdit from "./InvoiceItemCreateEdit";
import {
  invoiceCreateEditSchema,
  YupInvoiceCreateEdit,
  YupInvoiceItemCreateEdit,
} from "./yup/invoiceCreateEditSchema";

const createEmptyItem = (): YupInvoiceItemCreateEdit => ({
  id: undefined,
  productId: undefined,
  productCode: "",
  locationId: undefined,
  locationName: "",
  brand: "",
  model: "",
  imei: "",
  warrantyDurationMonths: undefined,
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  warrantyExpiryDate: null,
});

const formatDateInput = (value?: string) =>
  value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);

const mapDetailsToForm = (details: any): YupInvoiceCreateEdit => ({
  customerId: details.customerId ?? undefined,
  customerName: details.customerName ?? "",
  dateOfSale: formatDateInput(details.dateOfSale),
  salesPersonId: details.salesPersonId ?? "",
  warehouseId: details.warehouseId ?? "",
  salesTypeId: details.salesTypeId ?? undefined,
  paymentTypeId: details.paymentTypeId ?? undefined,
  paymentReference: details.paymentReference ?? "",
  remark: details.remark ?? "",
  invoiceItems: (details.invoiceItems ?? []).map((item: any) => ({
    id: item.id,
    productId: item.productId ?? undefined,
    productCode: item.productCode ?? "",
    locationId: item.locationId ?? undefined,
    locationName: item.locationName ?? item.location ?? "",
    brand: item.brand ?? "",
    model: item.model ?? "",
    imei: item.imei ?? "",
    warrantyDurationMonths: item.warrantyDurationMonths ?? undefined,
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? 0,
    totalPrice: item.totalPrice ?? 0,
    warrantyExpiryDate:
      item.warrantyExpiryDate ??
      calculateWarrantyExpiryDate(
        details.dateOfSale,
        item.warrantyDurationMonths
      ),
  })),
});

const InvoiceCreateEditPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const invoiceService = useInvoiceService();
  const notificationService = useNotificationService();
  const currentUserId = useMemo(() => {
    const token = window.localStorage.getItem("accessToken");
    if (!token) return "";
    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        decoded.nameid ||
        decoded.sub ||
        ""
      );
    } catch {
      return "";
    }
  }, []);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [initialValues, setInitialValues] = useState<YupInvoiceCreateEdit>({
    customerId: undefined,
    customerName: "",
    dateOfSale: formatDateInput(),
    salesPersonId: "",
    warehouseId: EMPTY_GUID as guid,
    salesTypeId: undefined,
    paymentTypeId: undefined,
    paymentReference: "",
    remark: "",
    invoiceItems: [],
  });
  const [pageBlocker, setPageBlocker] = useState(false);
  const [allowNavigationAfterSave, setAllowNavigationAfterSave] =
    useState(false);
  const [pageReady, setPageReady] = useState<boolean>(() => !id);
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    messages: string[];
  }>({ open: false, title: "", messages: [] });

  const [invoiceItemTable] = useInvoiceItemTable();

  useEffect(() => {
    if (!id) {
      setPageReady(true);
      return;
    }

    invoiceService
      .getInvoiceById(id)
      .then((invoice) => {
        const formValue = mapDetailsToForm({
          ...invoice,
        });
        setInvoiceNumber(invoice.number ?? "");
        if (formValue.invoiceItems.length === 0) {
          formValue.invoiceItems = [createEmptyItem()];
        }
        setInitialValues(formValue);
      })
      .catch((err) => {
        const messages = extractApiErrorMessages(err, t, "common");
        setErrorDialog({
          open: true,
          title: t("common:request-failed", {
            defaultValue: "Request failed",
          }),
          messages,
        });
      })
      .finally(() => {
        setAllowNavigationAfterSave(false);
        setPageReady(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formik = useFormik<YupInvoiceCreateEdit>({
    initialValues,
    enableReinitialize: true,
    validationSchema: invoiceCreateEditSchema,
    onSubmit: async (values, helpers) => {
      setPageBlocker(true);
      const payload: InvoiceCreateUpdateDto = {
        customerId: values.customerId || undefined,
        customerName: values.customerName || undefined,
        dateOfSale: values.dateOfSale,
        salesPersonId: values.salesPersonId || currentUserId || "",
        warehouseId: values.warehouseId,
        salesTypeId: values.salesTypeId || undefined,
        paymentTypeId: values.paymentTypeId || undefined,
        paymentReference: values.paymentReference || undefined,
        remark: values.remark || undefined,
        invoiceItems: values.invoiceItems.map((item) => ({
          id: item.id,
          productId: item.productId || undefined,
          locationId: item.locationId || undefined,
          warrantyDurationMonths: item.warrantyDurationMonths ?? undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice ?? item.unitPrice * item.quantity,
          warrantyExpiryDate: item.warrantyExpiryDate || undefined,
        })),
      };

      try {
        if (id) {
          await invoiceService.updateInvoice(id, payload);
          helpers.resetForm({ values });
          setAllowNavigationAfterSave(true);
          notificationService.handleApiSuccessMessage(
            "invoice",
            "updated",
            "common"
          );
          navigate(`/invoice/${id}`);
        } else {
          const created = await invoiceService.createInvoice(payload);
          helpers.resetForm({ values });
          setAllowNavigationAfterSave(true);
          notificationService.handleApiSuccessMessage(
            "invoice",
            "created",
            "common"
          );
          navigate(`/invoice/${created.id}`);
        }
      } catch (error: any) {
        const messages = extractApiErrorMessages(error, t, "common");
        setErrorDialog({
          open: true,
          title: t("common:request-failed", {
            defaultValue: "Request failed",
          }),
          messages,
        });
      } finally {
        helpers.setSubmitting(false);
        setPageBlocker(false);
      }
    },
  });

  const validationMessages = useMemo(
    () => flattenFormikErrors(formik.errors),
    [formik.errors]
  );

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

  useEffect(() => {
    const saleDate = formik.values.dateOfSale;
    formik.values.invoiceItems.forEach((item, index) => {
      const expiry = calculateWarrantyExpiryDate(
        saleDate,
        item.warrantyDurationMonths
      );
      const current = item.warrantyExpiryDate ?? null;
      if ((expiry || null) !== (current || null)) {
        formik.setFieldValue(
          `invoiceItems[${index}].warrantyExpiryDate`,
          expiry,
          false
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.dateOfSale,
    formik.values.invoiceItems
      .map((item) => `${item.warrantyDurationMonths ?? ""}`)
      .join("|"),
  ]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      setErrorDialog({
        open: true,
        title: t("common:please-fix-the-errors-and-try-again", {
          defaultValue: "Please fix the errors and try again",
        }),
        messages: validationMessages,
      });
    }
  }, [
    formik.submitCount,
    formik.isSubmitting,
    formik.isValid,
    t,
    validationMessages,
  ]);

  const pageTitle = id ? t("edit-invoice") : t("create-invoice");

  const breadcrumbs = id
    ? [
        { label: t("dashboard"), to: "/" },
        { label: t("invoice"), to: "/invoice" },
        { label: invoiceNumber || "", to: `/invoice/${id}` },
        { label: t("edit") },
      ]
    : [
        { label: t("dashboard"), to: "/" },
        { label: t("invoice"), to: "/invoice" },
        { label: t("create") },
      ];

  const {
    updateDatatableControls: updateInvoiceItemsTableControls,
    tableProps: invoiceItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  useEffect(() => {
    updateInvoiceItemsTableControls({
      data: formik.values.invoiceItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
  }, [formik.values.invoiceItems, updateInvoiceItemsTableControls]);

  const {
    addHandler: addInvoiceItemHandler,
    removeHandler: removeInvoiceItemHandler,
  } = useFormikDatatable(
    formik,
    invoiceItemsTableProps.pageSize,
    updateInvoiceItemsTableControls,
    "invoiceItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        invoiceItems:
          newValue ??
          formik.values.invoiceItems.map((_, i) => ({
            ...(formik.touched.invoiceItems?.[i] as any),
          })),
      });
    },
    createEmptyItem
  );

  const setAllFieldsTouched = async () => {
    const validationErrors = await formik.validateForm();
    formik.setTouched(setNestedObjectValues(validationErrors, true));
  };

  const changeTab = (val: number) => {
    setAllFieldsTouched();
    setTab(val);
  };
  const selectedInvoiceItem = invoiceItemsTableProps.selections[0];

  return (
    <>
      <Page
        title={pageTitle}
        subtitle={id ? invoiceNumber : ""}
        breadcrumbs={breadcrumbs}
        showLoading={!pageReady}
        showBackdrop={pageBlocker}
        actions={[
          {
            title: t("save"),
            onclick: formik.handleSubmit,
            icon: "Save",
          },
        ]}
        hasSingleActionButton
      >
        <NavBlocker
          when={
            !allowNavigationAfterSave &&
            !formik.isSubmitting &&
            !pageBlocker &&
            formik.dirty
          }
        ></NavBlocker>
        <FormikProvider value={formik}>
          <PbCard px={2} pt={2}>
            <PbTabs
              value={tab}
              onChange={(event: React.SyntheticEvent, newValue: number) => {
                changeTab(newValue);
              }}
            >
              <PbTab
                label={t("details")}
                haserror={formikObjectHasHeadTouchedErrors(
                  formik.errors,
                  formik.touched
                )}
              />
              <PbTab
                label={
                  <BadgeText
                    number={formik.values.invoiceItems.length}
                    label={t("invoice-items")}
                  />
                }
                haserror={formikObjectHasTouchedErrors(
                  formik.errors.invoiceItems,
                  formik.touched.invoiceItems
                )}
              />
            </PbTabs>
            <CardContent>
              <PbTabPanel value={tab} index={0}>
                <InvoiceHeadCreateEdit formik={formik} />
              </PbTabPanel>
              <PbTabPanel value={tab} index={1}>
                <DataTable
                  title={t("invoice-items")}
                  tableKey="InvoiceCreateEditPage-Items"
                  headerCells={invoiceItemTable}
                  data={invoiceItemsTableProps}
                  onAdd={addInvoiceItemHandler}
                  onDelete={(d) => removeInvoiceItemHandler(d)}
                  dataKey="key"
                  paddingEnabled={false}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t("select-row-to-edit")}
                  </Typography>
                  <Typography variant="h6">
                    {t("grand-total")}: {""}
                    {formik.values.invoiceItems
                      .reduce((sum, item) => sum + (item.totalPrice ?? 0), 0)
                      .toFixed(2)}
                  </Typography>
                </Stack>
              </PbTabPanel>
            </CardContent>
          </PbCard>

          {tab === 1 && selectedInvoiceItem !== undefined && (
            <InvoiceItemCreateEdit
              formik={formik}
              itemIndex={selectedInvoiceItem}
            />
          )}
        </FormikProvider>
      </Page>
      <MessageDialog
        open={errorDialog.open}
        title={
          errorDialog.title || t("common:error", { defaultValue: "Error" })
        }
        messages={errorDialog.messages}
        onClose={() => setErrorDialog((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default InvoiceCreateEditPage;
