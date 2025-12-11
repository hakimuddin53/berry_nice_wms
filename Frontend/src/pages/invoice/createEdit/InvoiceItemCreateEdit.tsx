import { MenuItem, TextField } from "@mui/material";
import { DataList, PageSection, PbCard } from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikErrors, FormikProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProductService } from "services/ProductService";
import { isRequiredField } from "utils/formikHelpers";
import {
  calculateWarrantyExpiryDate,
  formatWarrantyExpiry,
  WARRANTY_OPTIONS,
} from "utils/warranty";
import {
  invoiceCreateEditSchema,
  YupInvoiceCreateEdit,
} from "./yup/invoiceCreateEditSchema";

type ItemField = keyof YupInvoiceCreateEdit["invoiceItems"][number];

const InvoiceItemCreateEdit = (props: {
  formik: FormikProps<YupInvoiceCreateEdit>;
  itemIndex: number;
}) => {
  const { t } = useTranslation();
  const { formik, itemIndex } = props;
  const item = formik.values.invoiceItems[itemIndex];
  const productService = useProductService();

  const productIds = useMemo(
    () => (item.productId ? [item.productId as unknown as string] : []),
    [item.productId]
  );

  const productAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      if (!ids?.length && (!input || input.trim().length < 2)) {
        // Avoid spamming backend when there's no search term yet
        return [];
      }
      try {
        const results =
          (await productService.getSelectOptions(input, page, pageSize, ids)) ??
          [];
        return results.map((p: any) => ({
          label: p.label ?? p.productCode ?? "",
          value: p.value ?? p.id ?? p.productId ?? p.productCode,
          data: p.data ?? p,
        }));
      } catch (e) {
        return [];
      }
    },
    [productService]
  );

  const fieldName = (field: ItemField) => `invoiceItems[${itemIndex}].${field}`;

  const fieldTouched = (field: ItemField): boolean => {
    const touched = formik.touched.invoiceItems?.[itemIndex] as any;
    if (!touched) return false;
    const touchedValue = touched[field];
    if (typeof touchedValue === "boolean") {
      return touchedValue;
    }
    if (typeof touchedValue === "object") {
      return Object.values(touchedValue).some(Boolean);
    }
    return Boolean(touchedValue);
  };

  const fieldError = (
    field: ItemField
  ): string | FormikErrors<any> | undefined => {
    const errors = formik.errors.invoiceItems?.[itemIndex] as any;
    if (!errors || typeof errors === "string") {
      return undefined;
    }
    return errors[field] as string | FormikErrors<any> | undefined;
  };

  const warrantyExpiryText = formatWarrantyExpiry(item.warrantyExpiryDate);

  const handleWarrantyChange = (value: number | "") => {
    if (value === "") {
      formik.setFieldValue(fieldName("warrantyDurationMonths"), undefined);
      formik.setFieldValue(fieldName("warrantyExpiryDate"), null, false);
      formik.setFieldTouched(fieldName("warrantyDurationMonths"), true, false);
      return;
    }

    const numericValue = Number(value);
    formik.setFieldValue(fieldName("warrantyDurationMonths"), numericValue);
    formik.setFieldValue(
      fieldName("warrantyExpiryDate"),
      calculateWarrantyExpiryDate(formik.values.dateOfSale, numericValue),
      false
    );
    formik.setFieldTouched(fieldName("warrantyDurationMonths"), true, false);
  };

  return (
    <PageSection title={t("invoice-items")}>
      <PbCard px={2} pt={2}>
        <DataList
          hideDevider
          data={[
            {
              label: t("product-code"),
              required: isRequiredField(
                invoiceCreateEditSchema,
                "invoiceItems[0].productCode",
                formik.values
              ),
              value: (
                <SelectAsync2
                  name={fieldName("productCode")}
                  placeholder={t("product-code")}
                  ids={productIds}
                  asyncFunc={productAsync}
                suggestionsIfEmpty
                onSelectionChange={(option: any) => {
                  const data = option?.data ?? {};
                  formik.setFieldValue(
                    fieldName("productCode"),
                      data.productCode ?? option?.label ?? ""
                    );
                  formik.setFieldValue(
                    fieldName("productId"),
                    option?.value ?? undefined
                  );
                  formik.setFieldValue(
                    fieldName("imei"),
                    data.imei ?? item.imei ?? ""
                  );
                  if (
                    data.retailPrice !== undefined &&
                    data.retailPrice !== null
                  ) {
                    formik.setFieldValue(
                        fieldName("unitPrice"),
                        data.retailPrice
                      );
                      formik.setFieldValue(
                        fieldName("totalPrice"),
                        (data.retailPrice ?? 0) * (item.quantity ?? 0)
                      );
                    }
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("productCode"))
                  }
                  error={
                    fieldTouched("productCode") &&
                    Boolean(fieldError("productCode"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("productCode")}
                      error={fieldError("productCode")}
                      translatedFieldName={t("product-code")}
                    />
                  }
                />
              ),
            },
            {
              label: t("imei", { defaultValue: "IMEI/Serial Number" }),
              required: isRequiredField(
                invoiceCreateEditSchema,
                "invoiceItems[0].imei",
                formik.values
              ),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("imei")}
                  name={fieldName("imei")}
                  value={item.imei ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={fieldTouched("imei") && Boolean(fieldError("imei"))}
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("imei")}
                      error={fieldError("imei")}
                      translatedFieldName={t("imei", {
                        defaultValue: "IMEI/Serial Number",
                      })}
                    />
                  }
                />
              ),
            },
            {
              label: t("quantity"),
              required: isRequiredField(
                invoiceCreateEditSchema,
                "invoiceItems[0].quantity",
                formik.values
              ),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  id={fieldName("quantity")}
                  name={fieldName("quantity")}
                  value={item.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("quantity") && Boolean(fieldError("quantity"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("quantity")}
                      error={fieldError("quantity")}
                      translatedFieldName={t("quantity")}
                    />
                  }
                />
              ),
            },
            {
              label: t("unit-price-sold"),
              required: isRequiredField(
                invoiceCreateEditSchema,
                "invoiceItems[0].unitPrice",
                formik.values
              ),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  id={fieldName("unitPrice")}
                  name={fieldName("unitPrice")}
                  value={item.unitPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("unitPrice") &&
                    Boolean(fieldError("unitPrice"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("unitPrice")}
                      error={fieldError("unitPrice")}
                      translatedFieldName={t("unit-price-sold")}
                    />
                  }
                />
              ),
            },
            {
              label: t("warranty-duration-months"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  select
                  id={fieldName("warrantyDurationMonths")}
                  name={fieldName("warrantyDurationMonths")}
                  value={item.warrantyDurationMonths ?? ""}
                  onChange={(e) =>
                    handleWarrantyChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("warrantyDurationMonths") &&
                    Boolean(fieldError("warrantyDurationMonths"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("warrantyDurationMonths")}
                      error={fieldError("warrantyDurationMonths")}
                      translatedFieldName={t("warranty-duration-months")}
                    />
                  }
                >
                  <MenuItem value="">
                    {t("select", { defaultValue: "Select" })}{" "}
                    {t("warranty", { defaultValue: "Warranty" })}
                  </MenuItem>
                  {WARRANTY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            },
            {
              label:
                t("warranty", { defaultValue: "Warranty" }) +
                " " +
                t("expired", { defaultValue: "Expired" }),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  value={warrantyExpiryText || ""}
                  InputProps={{ readOnly: true }}
                  helperText={
                    warrantyExpiryText
                      ? t("calculated-from-date", {
                          defaultValue: "Calculated from invoice date",
                        })
                      : t("select-warranty-to-calc", {
                          defaultValue: "Select warranty to calculate expiry",
                        })
                  }
                />
              ),
            },
          ]}
        />
      </PbCard>
    </PageSection>
  );
};

export default InvoiceItemCreateEdit;
