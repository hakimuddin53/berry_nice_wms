import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PageSection, PbCard } from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { FormikErrors, FormikProps } from "formik";
import { useLookupSelectOptionsFetcher } from "hooks/queries/useLookupQueries";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_GUID } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  StockRecieveCreateEditSchema,
  YupStockRecieveCreateEdit,
} from "../yup/StockRecieveCreateEditSchema";

const parseRemarkSelections = (value?: string) => {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option.length > 0)
    )
  );
};

const StockRecieveItemCreateEdit = (props: {
  formik: FormikProps<YupStockRecieveCreateEdit>;
  itemIndex: number;
}) => {
  const { t } = useTranslation("common");
  const fetchLookupOptions = useLookupSelectOptionsFetcher();
  const formik = props.formik;
  const itemIndex = props.itemIndex;

  const [remarkOptions, setRemarkOptions] = useState<string[]>([]);

  const item = formik.values.stockRecieveItems[itemIndex];
  type ItemField = keyof typeof item;
  type SimpleItemField = ItemField;

  const fieldName = (field: ItemField) =>
    `stockRecieveItems[${itemIndex}].${field}`;

  const fieldTouched = (field: SimpleItemField): boolean => {
    const touched = formik.touched.stockRecieveItems?.[itemIndex] as any;
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
    field: SimpleItemField
  ): string | FormikErrors<any> | undefined => {
    const errors = formik.errors.stockRecieveItems?.[itemIndex] as any;
    if (!errors || typeof errors === "string") {
      return undefined;
    }
    return errors[field] as string | FormikErrors<any> | undefined;
  };

  const selectedRemarks = useMemo(
    () => parseRemarkSelections(item.remark),
    [item.remark]
  );

  const allRemarkOptions = useMemo(
    () => Array.from(new Set([...remarkOptions, ...selectedRemarks])),
    [remarkOptions, selectedRemarks]
  );

  useEffect(() => {
    let isActive = true;
    const PAGE_SIZE = 50;

    const loadRemarkOptions = async () => {
      try {
        const labels: string[] = [];
        let page = 1;
        while (true) {
          const chunk =
            (await fetchLookupOptions(
              LookupGroupKey.Remark,
              "",
              page,
              PAGE_SIZE
            )) ?? [];

          if (chunk.length === 0) break;

          labels.push(
            ...chunk
              .map((option) => option.label?.trim() ?? "")
              .filter((label) => label.length > 0)
          );

          if (chunk.length < PAGE_SIZE) break;
          page += 1;
        }

        if (isActive) {
          const unique = Array.from(new Set([...labels]));
          setRemarkOptions(unique);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Failed to load remark lookup options", err);
        }
        if (isActive) {
          setRemarkOptions([]);
        }
      }
    };

    loadRemarkOptions();

    return () => {
      isActive = false;
    };
  }, [fetchLookupOptions]);

  const updateRemarkSelections = (selections: string[]) => {
    formik.setFieldTouched(fieldName("remark"), true, false);
    formik.setFieldValue(fieldName("remark"), selections.join(", "));
  };

  const remarkHasError =
    fieldTouched("remark") && Boolean(fieldError("remark"));

  const yearDateValue = useMemo(() => {
    if (typeof item.year === "number") {
      return new Date(item.year, 0, 1);
    }
    return null;
  }, [item.year]);

  return (
    <PageSection title={t("common:items")}>
      <PbCard px={2} pt={2}>
        <Box mt={2} display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {t("common:details")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("model")}
                  id={fieldName("model")}
                  name={fieldName("model")}
                  size="small"
                  value={item.model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={fieldTouched("model") && Boolean(fieldError("model"))}
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("model")}
                      error={fieldError("model")}
                      translatedFieldName={t("model")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required={isRequiredField(
                    StockRecieveCreateEditSchema,
                    "StockRecieveItems[0].serialNumber",
                    formik.values
                  )}
                  label={t("imei", { defaultValue: "IMEI/Serial Number" })}
                  id={fieldName("serialNumber")}
                  name={fieldName("serialNumber")}
                  size="small"
                  value={item.serialNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("serialNumber") &&
                    Boolean(fieldError("serialNumber"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("serialNumber")}
                      error={fieldError("serialNumber")}
                      translatedFieldName={t("imei", {
                        defaultValue: "IMEI/Serial Number",
                      })}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  views={["year"]}
                  label={t("year", { defaultValue: "Year" })}
                  value={yearDateValue}
                  minDate={new Date(1990, 0, 1)}
                  maxDate={new Date(new Date().getFullYear(), 0, 1)}
                  onChange={(value) => {
                    formik.setFieldValue(
                      fieldName("year"),
                      value ? value.getFullYear() : null
                    );
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      onBlur: () =>
                        formik.setFieldTouched(fieldName("year"), true, false),
                      error:
                        fieldTouched("year") && Boolean(fieldError("year")),
                      helperText: (
                        <FormikErrorMessage
                          touched={fieldTouched("year")}
                          error={fieldError("year")}
                          translatedFieldName={t("year", {
                            defaultValue: "Year",
                          })}
                        />
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.ProductCategory}
                  name={fieldName("categoryId")}
                  label={t("category")}
                  value={item.categoryId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(
                      fieldName("categoryId"),
                      newValue || ""
                    )
                  }
                  onBlur={() => formik.setFieldTouched(fieldName("categoryId"))}
                  error={
                    fieldTouched("categoryId") &&
                    Boolean(fieldError("categoryId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("categoryId")}
                      error={fieldError("categoryId")}
                      translatedFieldName={t("category")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Brand}
                  name={fieldName("brandId")}
                  label={t("brand")}
                  value={item.brandId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(fieldName("brandId"), newValue || null)
                  }
                  onBlur={() => formik.setFieldTouched(fieldName("brandId"))}
                  error={
                    fieldTouched("brandId") && Boolean(fieldError("brandId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("brandId")}
                      error={fieldError("brandId")}
                      translatedFieldName={t("brand")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Color}
                  name={fieldName("colorId")}
                  label={t("colour")}
                  value={item.colorId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(fieldName("colorId"), newValue || null)
                  }
                  onBlur={() => formik.setFieldTouched(fieldName("colorId"))}
                  error={
                    fieldTouched("colorId") && Boolean(fieldError("colorId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("colorId")}
                      error={fieldError("colorId")}
                      translatedFieldName={t("colour")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Storage}
                  name={fieldName("storageId")}
                  label={t("storage")}
                  value={item.storageId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(
                      fieldName("storageId"),
                      newValue || null
                    )
                  }
                  onBlur={() => formik.setFieldTouched(fieldName("storageId"))}
                  error={
                    fieldTouched("storageId") &&
                    Boolean(fieldError("storageId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("storageId")}
                      error={fieldError("storageId")}
                      translatedFieldName={t("storage")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Ram}
                  name={fieldName("ramId")}
                  label={t("ram")}
                  value={item.ramId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(fieldName("ramId"), newValue || null)
                  }
                  onBlur={() => formik.setFieldTouched(fieldName("ramId"))}
                  error={fieldTouched("ramId") && Boolean(fieldError("ramId"))}
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("ramId")}
                      error={fieldError("ramId")}
                      translatedFieldName={t("ram")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Processor}
                  name={fieldName("processorId")}
                  label={t("processor")}
                  value={item.processorId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(
                      fieldName("processorId"),
                      newValue || null
                    )
                  }
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("processorId"))
                  }
                  error={
                    fieldTouched("processorId") &&
                    Boolean(fieldError("processorId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("processorId")}
                      error={fieldError("processorId")}
                      translatedFieldName={t("processor")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.ScreenSize}
                  name={fieldName("screenSizeId")}
                  label={t("screen-size")}
                  value={item.screenSizeId ?? ""}
                  onChange={(newValue) =>
                    formik.setFieldValue(
                      fieldName("screenSizeId"),
                      newValue || null
                    )
                  }
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("screenSizeId"))
                  }
                  error={
                    fieldTouched("screenSizeId") &&
                    Boolean(fieldError("screenSizeId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("screenSizeId")}
                      error={fieldError("screenSizeId")}
                      translatedFieldName={t("screen-size")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Grade}
                  name={fieldName("gradeId")}
                  label={t("grade")}
                  value={item.gradeId ?? ""}
                  onChange={(newValue, option) => {
                    formik.setFieldValue(fieldName("gradeId"), newValue || "");
                    formik.setFieldValue(
                      fieldName("gradeName"),
                      option?.label ?? ""
                    );
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("gradeId"), true, false)
                  }
                  error={
                    fieldTouched("gradeId") && Boolean(fieldError("gradeId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("gradeId")}
                      error={fieldError("gradeId")}
                      translatedFieldName={t("grade")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Region}
                  name={fieldName("regionId")}
                  label={t("region")}
                  value={item.regionId ?? ""}
                  onChange={(newValue, option) => {
                    formik.setFieldValue(fieldName("regionId"), newValue || "");
                    formik.setFieldValue(
                      fieldName("regionName"),
                      option?.label ?? ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched(fieldName("regionId"))}
                  error={
                    fieldTouched("regionId") && Boolean(fieldError("regionId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("regionId")}
                      error={fieldError("regionId")}
                      translatedFieldName={t("region")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.NewOrUsed}
                  name={fieldName("newOrUsedId")}
                  label={t("new-or-used")}
                  value={item.newOrUsedId ?? ""}
                  onChange={(newValue, option) => {
                    formik.setFieldValue(
                      fieldName("newOrUsedId"),
                      newValue || ""
                    );
                    formik.setFieldValue(
                      fieldName("newOrUsedName"),
                      option?.label ?? ""
                    );
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("newOrUsedId"))
                  }
                  error={
                    fieldTouched("newOrUsedId") &&
                    Boolean(fieldError("newOrUsedId"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("newOrUsedId")}
                      error={fieldError("newOrUsedId")}
                      translatedFieldName={t("new-or-used")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Location}
                  name={fieldName("locationId")}
                  label={t("location")}
                  value={
                    item.locationId && item.locationId !== EMPTY_GUID
                      ? item.locationId
                      : ""
                  }
                  onChange={(newValue, option) => {
                    formik.setFieldValue(
                      fieldName("locationId"),
                      newValue || EMPTY_GUID
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
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {t("pricing-and-remarks", {
                defaultValue: "Pricing & Notes",
              })}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  required={isRequiredField(
                    StockRecieveCreateEditSchema,
                    "StockRecieveItems[0].cost",
                    formik.values
                  )}
                  label={t("cost")}
                  id={fieldName("cost")}
                  name={fieldName("cost")}
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={item.cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={fieldTouched("cost") && Boolean(fieldError("cost"))}
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("cost")}
                      error={fieldError("cost")}
                      translatedFieldName={t("cost")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t("retail-selling-price")}
                  id={fieldName("retailSellingPrice")}
                  name={fieldName("retailSellingPrice")}
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={item.retailSellingPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("retailSellingPrice") &&
                    Boolean(fieldError("retailSellingPrice"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("retailSellingPrice")}
                      error={fieldError("retailSellingPrice")}
                      translatedFieldName={t("retail-selling-price")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t("dealer-selling-price")}
                  id={fieldName("dealerSellingPrice")}
                  name={fieldName("dealerSellingPrice")}
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={item.dealerSellingPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("dealerSellingPrice") &&
                    Boolean(fieldError("dealerSellingPrice"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("dealerSellingPrice")}
                      error={fieldError("dealerSellingPrice")}
                      translatedFieldName={t("dealer-selling-price")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={t("agent-selling-price")}
                  id={fieldName("agentSellingPrice")}
                  name={fieldName("agentSellingPrice")}
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={item.agentSellingPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("agentSellingPrice") &&
                    Boolean(fieldError("agentSellingPrice"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("agentSellingPrice")}
                      error={fieldError("agentSellingPrice")}
                      translatedFieldName={t("agent-selling-price")}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={allRemarkOptions}
                  value={selectedRemarks}
                  onChange={(_, newValue) => {
                    const selections = (newValue || []).map((v) =>
                      typeof v === "string" ? v.trim() : v
                    );
                    const unique = Array.from(
                      new Set(selections.filter((option) => option.length > 0))
                    );
                    updateRemarkSelections(unique);
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(fieldName("remark"), true, false)
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        label={option}
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("remark")}
                      size="small"
                      error={remarkHasError}
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("remark")}
                          error={fieldError("remark")}
                          translatedFieldName={t("remark")}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label={t("internal-remark")}
                  id={fieldName("internalRemark")}
                  name={fieldName("internalRemark")}
                  placeholder={t("enter-internal-remark")}
                  value={item.internalRemark ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    fieldTouched("internalRemark") &&
                    Boolean(fieldError("internalRemark"))
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={fieldTouched("internalRemark")}
                      error={fieldError("internalRemark")}
                      translatedFieldName={t("internal-remark")}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PbCard>
    </PageSection>
  );
};

export default StockRecieveItemCreateEdit;
