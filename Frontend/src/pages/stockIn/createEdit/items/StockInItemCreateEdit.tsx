import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  DataList,
  PageSection,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { FormikErrors, FormikProps } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_GUID } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  stockInCreateEditSchema,
  YupStockInCreateEdit,
} from "../yup/stockInCreateEditSchema";

const PRESET_REMARK_OPTIONS = [
  "Faulty",
  "Screen Crack",
  "No Dispaly",
  "Battery rosak",
  "Motherboard faulty",
  "Power adapter issue",
];

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

const StockInItemCreateEdit = (props: {
  formik: FormikProps<YupStockInCreateEdit>;
  itemIndex: number;
}) => {
  const { t } = useTranslation("common");
  const formik = props.formik;
  const itemIndex = props.itemIndex;

  const [activeTab, setActiveTab] = useState(0);

  const item = formik.values.stockInItems[itemIndex];
  type ItemField = keyof typeof item;
  type SimpleItemField = ItemField;

  const fieldName = (field: ItemField) => `stockInItems[${itemIndex}].${field}`;

  const fieldTouched = (field: SimpleItemField): boolean => {
    const touched = formik.touched.stockInItems?.[itemIndex] as any;
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
    const errors = formik.errors.stockInItems?.[itemIndex] as any;
    if (!errors || typeof errors === "string") {
      return undefined;
    }
    return errors[field] as string | FormikErrors<any> | undefined;
  };

  const selectedRemarks = useMemo(
    () => parseRemarkSelections(item.remark),
    [item.remark]
  );

  const remarkOptions = useMemo(() => {
    const additionalSelections = selectedRemarks.filter(
      (option) => !PRESET_REMARK_OPTIONS.includes(option)
    );

    return [...PRESET_REMARK_OPTIONS, ...additionalSelections];
  }, [selectedRemarks]);

  const updateRemarkSelections = (selections: string[]) => {
    formik.setFieldTouched(fieldName("remark"), true, false);
    formik.setFieldValue(fieldName("remark"), selections.join(", "));
  };

  const handleRemarkSelectionChange = (
    event: SelectChangeEvent<typeof selectedRemarks>
  ) => {
    const {
      target: { value },
    } = event;
    const selections =
      typeof value === "string"
        ? value
            .split(",")
            .map((option) => option.trim())
            .filter((option) => option.length > 0)
        : value;

    const uniqueSelections = Array.from(new Set(selections));
    updateRemarkSelections(uniqueSelections);
  };

  const handleRemarkBlur = () => {
    formik.setFieldTouched(fieldName("remark"), true, false);
  };

  const handleRemarkChipDelete = (chipValue: string) => {
    const filtered = selectedRemarks.filter((value) => value !== chipValue);
    updateRemarkSelections(filtered);
  };

  const remarkHasError =
    fieldTouched("remark") && Boolean(fieldError("remark"));

  return (
    <PageSection title={t("common:items")}>
      <PbCard px={2} pt={2}>
        <PbTabs
          value={activeTab}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setActiveTab(newValue);
          }}
        >
          <PbTab label={t("details")} />
          <PbTab label={t("pricing")} />
          <PbTab label={t("remarks")} />
        </PbTabs>

        <PbTabPanel value={activeTab} index={0}>
          <Box mt={6}>
            <DataList
              hideDevider={true}
              data={[
                {
                  label: t("product-code"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("productCode")}
                      name={fieldName("productCode")}
                      size="small"
                      value={item.productCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                  label: t("model"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("model")}
                      name={fieldName("model")}
                      size="small"
                      value={item.model}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        fieldTouched("model") && Boolean(fieldError("model"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("model")}
                          error={fieldError("model")}
                          translatedFieldName={t("model")}
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
                      id={fieldName("primarySerialNumber")}
                      name={fieldName("primarySerialNumber")}
                      size="small"
                      value={item.primarySerialNumber}
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
                      id={fieldName("manufactureSerialNumber")}
                      name={fieldName("manufactureSerialNumber")}
                      size="small"
                      value={item.manufactureSerialNumber}
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
                  label: t("category"),
                  required: isRequiredField(
                    stockInCreateEditSchema,
                    "stockInItems[0].categoryId",
                    formik.values
                  ),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.ProductCategory}
                      name={fieldName("categoryId")}
                      value={item.categoryId ?? ""}
                      onChange={(newValue) =>
                        formik.setFieldValue(
                          fieldName("categoryId"),
                          newValue || null
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("categoryId"))
                      }
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
                  ),
                },
                {
                  label: t("brand"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Brand}
                      name={fieldName("brandId")}
                      value={item.brandId ?? ""}
                      onChange={(newValue) =>
                        formik.setFieldValue(
                          fieldName("brandId"),
                          newValue || null
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("brandId"))
                      }
                      error={
                        fieldTouched("brandId") &&
                        Boolean(fieldError("brandId"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("brandId")}
                          error={fieldError("brandId")}
                          translatedFieldName={t("brand")}
                        />
                      }
                    />
                  ),
                },

                {
                  label: t("colour"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Color}
                      name={fieldName("colorId")}
                      value={item.colorId ?? ""}
                      onChange={(newValue) =>
                        formik.setFieldValue(
                          fieldName("colorId"),
                          newValue || null
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("colorId"))
                      }
                      error={
                        fieldTouched("colorId") &&
                        Boolean(fieldError("colorId"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("colorId")}
                          error={fieldError("colorId")}
                          translatedFieldName={t("colour")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("storage"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Storage}
                      name={fieldName("storageId")}
                      value={item.storageId ?? ""}
                      onChange={(newValue) =>
                        formik.setFieldValue(
                          fieldName("storageId"),
                          newValue || null
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("storageId"))
                      }
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
                  ),
                },
                {
                  label: t("ram"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Ram}
                      name={fieldName("ramId")}
                      value={item.ramId ?? ""}
                      onChange={(newValue) =>
                        formik.setFieldValue(
                          fieldName("ramId"),
                          newValue || null
                        )
                      }
                      onBlur={() => formik.setFieldTouched(fieldName("ramId"))}
                      error={
                        fieldTouched("ramId") && Boolean(fieldError("ramId"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("ramId")}
                          error={fieldError("ramId")}
                          translatedFieldName={t("ram")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("processor"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Processor}
                      name={fieldName("processorId")}
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
                  ),
                },
                {
                  label: t("screen-size"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.ScreenSize}
                      name={fieldName("screenSizeId")}
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
                  ),
                },
                {
                  label: t("location"),
                  required: isRequiredField(
                    stockInCreateEditSchema,
                    "stockInItems[0].locationId",
                    formik.values
                  ),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Location}
                      name={fieldName("locationId")}
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
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("locationId"))
                      }
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
                  label: t("region"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.Region}
                      name={fieldName("region")}
                      value={item.region ?? ""}
                      onChange={(_, option) =>
                        formik.setFieldValue(
                          fieldName("region"),
                          option?.label ?? ""
                        )
                      }
                      onBlur={() => formik.setFieldTouched(fieldName("region"))}
                      error={
                        fieldTouched("region") && Boolean(fieldError("region"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("region")}
                          error={fieldError("region")}
                          translatedFieldName={t("region")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("new-or-used"),
                  value: (
                    <LookupAutocomplete
                      groupKey={LookupGroupKey.NewOrUsed}
                      name={fieldName("newOrUsed")}
                      value={item.newOrUsed ?? ""}
                      onChange={(_, option) =>
                        formik.setFieldValue(
                          fieldName("newOrUsed"),
                          option?.label ?? ""
                        )
                      }
                      onBlur={() =>
                        formik.setFieldTouched(fieldName("newOrUsed"))
                      }
                      error={
                        fieldTouched("newOrUsed") &&
                        Boolean(fieldError("newOrUsed"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("newOrUsed")}
                          error={fieldError("newOrUsed")}
                          translatedFieldName={t("new-or-used")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("quantity"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("receiveQuantity")}
                      name={fieldName("receiveQuantity")}
                      size="small"
                      type="number"
                      value={item.receiveQuantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        fieldTouched("receiveQuantity") &&
                        Boolean(fieldError("receiveQuantity"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("receiveQuantity")}
                          error={fieldError("receiveQuantity")}
                          translatedFieldName={t("quantity")}
                        />
                      }
                    />
                  ),
                },
              ]}
            />
          </Box>
        </PbTabPanel>

        <PbTabPanel value={activeTab} index={1}>
          <Box mt={6}>
            <DataList
              hideDevider={true}
              data={[
                {
                  label: t("cost"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("cost")}
                      name={fieldName("cost")}
                      size="small"
                      type="number"
                      value={item.cost}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        fieldTouched("cost") && Boolean(fieldError("cost"))
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={fieldTouched("cost")}
                          error={fieldError("cost")}
                          translatedFieldName={t("cost")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("retail-selling-price"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("retailSellingPrice")}
                      name={fieldName("retailSellingPrice")}
                      size="small"
                      type="number"
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
                  ),
                },
                {
                  label: t("dealer-selling-price"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("dealerSellingPrice")}
                      name={fieldName("dealerSellingPrice")}
                      size="small"
                      type="number"
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
                  ),
                },
                {
                  label: t("agent-selling-price"),
                  value: (
                    <TextField
                      fullWidth
                      id={fieldName("agentSellingPrice")}
                      name={fieldName("agentSellingPrice")}
                      size="small"
                      type="number"
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
                  ),
                },
              ]}
            />
          </Box>
        </PbTabPanel>

        <PbTabPanel value={activeTab} index={2}>
          <Box mt={6}>
            <FormControl fullWidth error={remarkHasError}>
              <InputLabel id={`${fieldName("remark")}-label`}>
                {t("remark")}
              </InputLabel>
              <Select
                labelId={`${fieldName("remark")}-label`}
                id={fieldName("remark")}
                multiple
                value={selectedRemarks}
                onChange={handleRemarkSelectionChange}
                onBlur={handleRemarkBlur}
                input={<OutlinedInput label={t("remark")} />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        onMouseDown={(event) => event.stopPropagation()}
                        onDelete={() => handleRemarkChipDelete(value)}
                      />
                    ))}
                  </Box>
                )}
              >
                {remarkOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedRemarks.indexOf(option) > -1} />
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                <FormikErrorMessage
                  touched={fieldTouched("remark")}
                  error={fieldError("remark")}
                  translatedFieldName={t("remark")}
                />
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              multiline
              minRows={3}
              id={fieldName("internalRemark")}
              name={fieldName("internalRemark")}
              label={t("internal-remark")}
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
          </Box>
        </PbTabPanel>
      </PbCard>
    </PageSection>
  );
};

export default StockInItemCreateEdit;
