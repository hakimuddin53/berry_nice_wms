import { TextField } from "@mui/material";
import { DataList, PageSection, PbCard } from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikErrors, FormikProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProductService } from "services/ProductService";
import { isRequiredField } from "utils/formikHelpers";
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
          (await productService.getSelectOptions(
            input,
            page + 1,
            pageSize,
            ids
          )) ?? [];
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
                    formik.setFieldValue(
                      fieldName("productCode"),
                      option?.data?.productCode ?? option?.label ?? ""
                    );
                    formik.setFieldValue(
                      fieldName("productId"),
                      option?.value ?? undefined
                    );
                    formik.setFieldValue(
                      fieldName("description"),
                      option?.data?.productName ??
                        option?.data?.description ??
                        option?.label ??
                        item.description ??
                        ""
                    );
                    formik.setFieldValue(
                      fieldName("primarySerialNumber"),
                      option?.data?.primarySerialNumber ??
                        item.primarySerialNumber ??
                        ""
                    );
                    formik.setFieldValue(
                      fieldName("manufactureSerialNumber"),
                      option?.data?.manufactureSerialNumber ??
                        item.manufactureSerialNumber ??
                        ""
                    );
                    formik.setFieldValue(
                      fieldName("unitOfMeasure"),
                      option?.data?.unitOfMeasure ?? item.unitOfMeasure ?? ""
                    );
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
              label: t("description"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("description")}
                  name={fieldName("description")}
                  value={item.description ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("description") &&
                    Boolean(fieldError("description"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("description")}
                      error={fieldError("description")}
                      translatedFieldName={t("description")}
                    />
                  }
                />
              ),
            },
            {
              label: t("primary-serial-number"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("primarySerialNumber")}
                  name={fieldName("primarySerialNumber")}
                  value={item.primarySerialNumber ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("primarySerialNumber") &&
                    Boolean(fieldError("primarySerialNumber"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("primarySerialNumber")}
                      error={fieldError("primarySerialNumber")}
                      translatedFieldName={t("primary-serial-number")}
                    />
                  }
                />
              ),
            },
            {
              label: t("manufacture-serial-number"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("manufactureSerialNumber")}
                  name={fieldName("manufactureSerialNumber")}
                  value={item.manufactureSerialNumber ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("manufactureSerialNumber") &&
                    Boolean(fieldError("manufactureSerialNumber"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("manufactureSerialNumber")}
                      error={fieldError("manufactureSerialNumber")}
                      translatedFieldName={t("manufacture-serial-number")}
                    />
                  }
                />
              ),
            },
            {
              label: t("uom"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("unitOfMeasure")}
                  name={fieldName("unitOfMeasure")}
                  value={item.unitOfMeasure ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("unitOfMeasure") &&
                    Boolean(fieldError("unitOfMeasure"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("unitOfMeasure")}
                      error={fieldError("unitOfMeasure")}
                      translatedFieldName={t("uom")}
                    />
                  }
                />
              ),
            },
            {
              label: t("status"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("status")}
                  name={fieldName("status")}
                  value={item.status ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              label: t("total-price"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  id={fieldName("totalPrice")}
                  name={fieldName("totalPrice")}
                  value={item.totalPrice ?? 0}
                  InputProps={{ readOnly: true }}
                />
              ),
            },
            {
              label: t("warranty-duration-months"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  id={fieldName("warrantyDurationMonths")}
                  name={fieldName("warrantyDurationMonths")}
                  value={item.warrantyDurationMonths ?? 0}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
