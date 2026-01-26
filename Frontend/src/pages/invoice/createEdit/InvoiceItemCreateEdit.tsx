import { MenuItem, TextField } from "@mui/material";
import { DataList, PageSection, PbCard } from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import ProductCodeScanInvoice from "components/platbricks/shared/ProductCodeScanInvoice";
import { FormikErrors, FormikProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useLookupService } from "services/LookupService";
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
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";

type ItemField = keyof YupInvoiceCreateEdit["invoiceItems"][number];

const InvoiceItemCreateEdit = (props: {
  formik: FormikProps<YupInvoiceCreateEdit>;
  itemIndex: number;
}) => {
  const { t } = useTranslation();
  const { formik, itemIndex } = props;
  const item = formik.values.invoiceItems[itemIndex];
  const productService = useProductService();
  const lookupService = useLookupService();
  const serviceProductCodes = ["POSTAGE", "LALAMOVE", "ACCESSORY"];

  const productIds = useMemo(
    () => (item.productId ? [item.productId as unknown as string] : []),
    [item.productId]
  );

  const locationIds = useMemo(
    () => (item.locationId ? [item.locationId as unknown as string] : []),
    [item.locationId]
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

  const locationAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      try {
        const options = await lookupService.getSelectOptions(
          LookupGroupKey.Location,
          input,
          page,
          pageSize,
          ids
        );
        return (options ?? []).map((option) => ({
          label: option.label ?? "",
          value: option.value ?? option.label ?? "",
        }));
      } catch (err) {
        return [];
      }
    },
    [lookupService]
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

  const resetProductDerivedValues = () => {
    formik.setFieldValue(fieldName("productCode"), "");
    formik.setFieldValue(fieldName("productId"), undefined);
    formik.setFieldValue(fieldName("imei"), "");
    formik.setFieldValue(fieldName("locationId"), undefined);
    formik.setFieldValue(fieldName("locationName"), "");
    formik.setFieldValue(fieldName("brand"), "");
    formik.setFieldValue(fieldName("model"), "");
    formik.setFieldValue(fieldName("unitPrice"), 0);
    formik.setFieldValue(fieldName("totalPrice"), 0);
    formik.setFieldValue(fieldName("quantity"), 1);
  };

  const fetchProductDetailsIfMissing = useCallback(
    async (data: any, productId?: string) => {
      if (!productId) {
        return data ?? {};
      }

      const hasBrand =
        data?.brand ??
        data?.Brand ??
        data?.brandName ??
        data?.BrandName ??
        data?.brandLabel ??
        data?.BrandLabel ??
        data?.brandId ??
        data?.BrandId;
      const hasModel =
        data?.model ??
        data?.Model ??
        data?.productName ??
        data?.ProductName ??
        data?.modelName ??
        data?.ModelName ??
        data?.productModel;
      const hasLocation = data?.locationId ?? data?.currentLocationId;

      if (hasBrand && hasModel && hasLocation) {
        return data ?? {};
      }

      try {
        const details = await productService.getProductById(productId);
        return {
          ...data,
          ...details,
          productId: details.productId ?? productId,
          productCode: details.productCode ?? data?.productCode,
          locationId: details.locationId ?? data?.locationId,
        };
      } catch {
        return data ?? {};
      }
    },
    [productService]
  );

  const populateFromProduct = useCallback(
    async (option: any) => {
      const baseData = option?.data ?? {};
      const productId =
        (option?.value as string | undefined) ??
        (baseData?.productId as string | undefined) ??
        (baseData?.id as string | undefined);
      const data = await fetchProductDetailsIfMissing(baseData, productId);

      formik.setFieldValue(
        fieldName("productCode"),
        data.productCode ?? option?.label ?? ""
      );
      formik.setFieldValue(fieldName("productId"), option?.value ?? undefined);

      const imeiValue =
        data.imei ?? data.serialNumber ?? data.serialNumber ?? "";
      formik.setFieldValue(fieldName("imei"), imeiValue);

      const locationId =
        data.locationId ??
        data.currentLocationId ??
        data.location?.id ??
        data.location;
      const locationNameRaw =
        data.locationName ??
        data.currentLocation ??
        data.locationLabel ??
        data.location;
      const normalizedLocationId =
        typeof locationId === "string" ? locationId : undefined;
      const normalizedLocationName =
        typeof locationNameRaw === "string" ||
        typeof locationNameRaw === "number"
          ? String(locationNameRaw)
          : "";
      formik.setFieldValue(fieldName("locationId"), normalizedLocationId);
      formik.setFieldValue(fieldName("locationName"), normalizedLocationName);

      let brand =
        data.brand ??
        data.Brand ??
        data.brandName ??
        data.BrandName ??
        data.brandLabel ??
        data.BrandLabel ??
        data.brandId ??
        data.BrandId ??
        "";
      let model =
        data.model ??
        data.Model ??
        data.productName ??
        data.ProductName ??
        data.modelName ??
        data.ModelName ??
        data.productModel ??
        data.ProductModel ??
        "";

      // Fallback: if model/brand are still empty, try a select-options lookup by id
      if ((!brand || !model) && productId) {
        try {
          const opts =
            (await productService.getSelectOptions("", 1, 1, [productId])) ??
            [];
          const hit = opts[0] as any;
          if (!brand) {
            brand =
              hit?.brand ??
              hit?.Brand ??
              hit?.brandName ??
              hit?.BrandName ??
              hit?.data?.brand ??
              hit?.data?.Brand ??
              "";
          }
          if (!model) {
            model =
              hit?.model ??
              hit?.Model ??
              hit?.data?.model ??
              hit?.data?.Model ??
              hit?.data?.productName ??
              hit?.data?.ProductName ??
              "";
          }
        } catch {
          // ignore lookup failures
        }
      }

      formik.setFieldValue(fieldName("brand"), brand ?? "");
      formik.setFieldValue(fieldName("model"), model ?? "");

      const unitPriceRaw =
        data.retailPrice ?? data.unitPrice ?? data.price ?? item.unitPrice ?? 0;
      const unitPrice =
        unitPriceRaw === "" ||
        unitPriceRaw === null ||
        unitPriceRaw === undefined
          ? 0
          : Number(unitPriceRaw);
      const quantity = 1;
      formik.setFieldValue(fieldName("unitPrice"), unitPrice ?? 0);
      formik.setFieldValue(fieldName("quantity"), quantity);
      formik.setFieldValue(
        fieldName("totalPrice"),
        Number(unitPrice ?? 0) * quantity
      );
    },
    [fetchProductDetailsIfMissing, fieldName, formik, item.unitPrice]
  );

  const handleWarrantyChange = (value: number | "") => {
    if (value === "") {
      formik.setFieldValue(fieldName("warrantyDurationMonths"), undefined);
      formik.setFieldValue(fieldName("warrantyExpiryDate"), null, false);
      formik.setFieldTouched(fieldName("warrantyDurationMonths"), true, false);
      return;
    }

    const numericValue = Math.max(0, Number(value));
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
                <ProductCodeScanInvoice
                  label={t("product-code")}
                  warehouseId={formik.values.warehouseId as string}
                  serviceCodes={serviceProductCodes}
                  onResolved={async (option) => {
                    await populateFromProduct({
                      value: option.productId,
                      label: option.productCode,
                      data: {
                        productId: option.productId,
                        productCode: option.productCode,
                      },
                    });
                  }}
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
                  onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
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
              label: t("model"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("model")}
                  name={fieldName("model")}
                  value={item.model ?? ""}
                  InputProps={{ readOnly: true }}
                  onBlur={formik.handleBlur}
                />
              ),
            },
            {
              label: t("brand"),
              value: (
                <TextField
                  fullWidth
                  size="small"
                  id={fieldName("brand")}
                  name={fieldName("brand")}
                  value={item.brand ?? ""}
                  InputProps={{ readOnly: true }}
                  onBlur={formik.handleBlur}
                />
              ),
            },
            {
              label: t("location"),
              required: isRequiredField(
                invoiceCreateEditSchema,
                "invoiceItems[0].locationId",
                formik.values
              ),
              value: (
                <SelectAsync2
                  name={fieldName("locationId")}
                  placeholder={t("location")}
                  ids={locationIds}
                  suggestionsIfEmpty
                  asyncFunc={locationAsync}
                  onSelectionChange={(option: any) => {
                    formik.setFieldValue(
                      fieldName("locationId"),
                      option?.value ?? undefined
                    );
                    formik.setFieldValue(
                      fieldName("locationName"),
                      option?.label ?? ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched(fieldName("locationId"))}
                  error={
                    fieldTouched("locationId") &&
                    Boolean(fieldError("locationId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("locationId")}
                      error={fieldError("locationId")}
                      translatedFieldName={t("location")}
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
                  onChange={(e) =>
                    formik.setFieldValue(
                      fieldName("unitPrice"),
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
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
