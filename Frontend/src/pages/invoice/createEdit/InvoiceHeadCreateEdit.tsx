import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import SelectAsync2, {
  SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCustomerService } from "services/CustomerService";
import { useUserService } from "services/UserService";
import { isRequiredField } from "utils/formikHelpers";
import {
  invoiceCreateEditSchema,
  YupInvoiceCreateEdit,
} from "./yup/invoiceCreateEditSchema";

const InvoiceHeadCreateEdit = (props: {
  formik: FormikProps<YupInvoiceCreateEdit>;
}) => {
  const { t } = useTranslation();
  const formik = props.formik;
  const customerService = useCustomerService();
  const userService = useUserService();

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

  const createStaticOptions = useCallback((ids?: string[]) => {
    if (!ids || ids.length === 0) return [] as SelectAsyncOption[];
    return ids
      .filter((value) => !!value)
      .map(
        (value) =>
          ({
            label: value,
            value,
          } as SelectAsyncOption)
      );
  }, []);

  const normalizeOptions = useCallback((options: SelectAsyncOption[] = []) => {
    return options.map(
      (option) =>
        ({
          label: option.label ?? "",
          value: option.value ?? option.label ?? "",
        } as SelectAsyncOption)
    );
  }, []);

  const customerAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      if (ids && ids.length > 0) {
        return createStaticOptions(ids);
      }
      const options = await customerService.getSelectOptions(
        input,
        page,
        pageSize,
        ids
      );
      return normalizeOptions(options);
    },
    [createStaticOptions, customerService, normalizeOptions]
  );

  const userAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      const options = await userService.getSelectOptions(
        input ?? "",
        page,
        pageSize,
        ids
      );

      if ((ids?.length ?? 0) > 0 && (input ?? "").trim().length === 0) {
        const general = await userService.getSelectOptions("", 1, pageSize, []);
        const seen = new Set<string>();
        const merged = [...options, ...general].filter((opt) => {
          const key = opt.value ?? opt.label ?? "";
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return normalizeOptions(merged);
      }

      return normalizeOptions(options);
    },
    [normalizeOptions, userService]
  );

  return (
    <DataList
      hideDevider
      data={[
        {
          label: t("customer"),
          required: isRequiredField(
            invoiceCreateEditSchema,
            "customerId",
            formik.values
          ),
          value: (
            <SelectAsync2
              name="customerId"
              placeholder={t("customer")}
              suggestionsIfEmpty
              error={
                formik.touched.customerId && Boolean(formik.errors.customerId)
              }
              onBlur={() => formik.setFieldTouched("customerId")}
              ids={customerIds}
              asyncFunc={customerAsync}
              onSelectionChange={(option) => {
                formik.setFieldValue("customerId", option?.value ?? undefined);
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
          ),
        },
        {
          label: t("date-of-sale"),
          required: isRequiredField(
            invoiceCreateEditSchema,
            "dateOfSale",
            formik.values
          ),
          value: (
            <TextField
              fullWidth
              size="small"
              id="dateOfSale"
              name="dateOfSale"
              type="date"
              value={formik.values.dateOfSale}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              InputLabelProps={{ shrink: true }}
              error={
                formik.touched.dateOfSale && Boolean(formik.errors.dateOfSale)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.dateOfSale}
                  error={formik.errors.dateOfSale}
                  translatedFieldName={t("date-of-sale")}
                />
              }
            />
          ),
        },
        {
          label: t("sales-person"),
          required: isRequiredField(
            invoiceCreateEditSchema,
            "salesPersonId",
            formik.values
          ),
          value: (
            <SelectAsync2
              name="salesPersonId"
              placeholder={t("sales-person")}
              suggestionsIfEmpty
              ids={salesPersonIds}
              asyncFunc={userAsync}
              error={
                formik.touched.salesPersonId &&
                Boolean(formik.errors.salesPersonId)
              }
              onBlur={() => formik.setFieldTouched("salesPersonId")}
              onSelectionChange={(option) =>
                formik.setFieldValue("salesPersonId", option?.value ?? "")
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.salesPersonId}
                  error={formik.errors.salesPersonId}
                  translatedFieldName={t("sales-person")}
                />
              }
            />
          ),
        },
        {
          label: t("warehouse"),
          required: isRequiredField(
            invoiceCreateEditSchema,
            "warehouseId",
            formik.values
          ),
          value: (
            <LookupAutocomplete
              groupKey={LookupGroupKey.Warehouse}
              name="warehouseId"
              value={formik.values.warehouseId ?? ""}
              onChange={(newValue) =>
                formik.setFieldValue("warehouseId", newValue || "")
              }
              onBlur={() => formik.setFieldTouched("warehouseId")}
              error={
                formik.touched.warehouseId && Boolean(formik.errors.warehouseId)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.warehouseId}
                  error={formik.errors.warehouseId}
                  translatedFieldName={t("warehouse")}
                />
              }
            />
          ),
        },
        {
          label: t("sales-type"),
          value: (
            <LookupAutocomplete
              groupKey={LookupGroupKey.SalesType}
              name="salesTypeId"
              value={formik.values.salesTypeId ?? ""}
              onChange={(newValue) =>
                formik.setFieldValue("salesTypeId", newValue || undefined)
              }
              onBlur={() => formik.setFieldTouched("salesTypeId")}
              error={
                formik.touched.salesTypeId && Boolean(formik.errors.salesTypeId)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.salesTypeId}
                  error={formik.errors.salesTypeId}
                  translatedFieldName={t("sales-type")}
                />
              }
            />
          ),
        },
        {
          label: t("payment-type"),
          value: (
            <LookupAutocomplete
              groupKey={LookupGroupKey.PaymentType}
              name="paymentTypeId"
              value={formik.values.paymentTypeId ?? ""}
              onChange={(newValue) =>
                formik.setFieldValue("paymentTypeId", newValue || undefined)
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
          ),
        },
        {
          label: t("payment-reference"),
          value: (
            <TextField
              fullWidth
              size="small"
              id="paymentReference"
              name="paymentReference"
              value={formik.values.paymentReference ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ),
        },
        {
          label: t("remark"),
          value: (
            <TextField
              fullWidth
              size="small"
              id="remark"
              name="remark"
              value={formik.values.remark ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              minRows={2}
            />
          ),
        },
      ]}
    />
  );
};

export default InvoiceHeadCreateEdit;
