import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_GUID } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  stockInCreateEditSchema,
  YupStockInCreateEdit,
  YupStockInItemRemarkCreateEdit,
} from "../yup/stockInCreateEditSchema";

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
  type SimpleItemField = Exclude<ItemField, "stockInItemRemarks">;

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

  const remarks: YupStockInItemRemarkCreateEdit[] =
    item.stockInItemRemarks ?? [];

  const remarksFieldName = (remarkIndex: number) =>
    `stockInItems[${itemIndex}].stockInItemRemarks[${remarkIndex}].remark`;

  const getRemarkTouched = (remarkIndex: number): boolean => {
    const touchedItem = formik.touched.stockInItems?.[itemIndex] as any;
    const touchedRemarks = touchedItem?.stockInItemRemarks;
    if (!Array.isArray(touchedRemarks)) return false;
    const touchedRemark = touchedRemarks[remarkIndex];
    if (!touchedRemark) return false;
    if (typeof touchedRemark === "boolean") return touchedRemark;
    return Boolean(touchedRemark.remark);
  };

  const getRemarkError = (remarkIndex: number) => {
    const itemErrors = formik.errors.stockInItems?.[itemIndex] as any;
    if (!itemErrors || typeof itemErrors === "string") {
      return itemErrors;
    }

    const remarksErrors = itemErrors.stockInItemRemarks;
    if (Array.isArray(remarksErrors)) {
      const remarkError = remarksErrors[remarkIndex];
      if (!remarkError) return undefined;
      if (typeof remarkError === "string") return remarkError;
      if (remarkError && typeof remarkError === "object") {
        if ("remark" in remarkError) {
          return remarkError.remark;
        }
      }
      return remarkError;
    }

    if (remarksErrors && typeof remarksErrors === "object") {
      if ("remark" in remarksErrors) {
        return remarksErrors.remark;
      }
    }

    return remarksErrors;
  };

  const setRemarksValue = (nextRemarks: YupStockInItemRemarkCreateEdit[]) => {
    formik.setFieldValue(fieldName("stockInItemRemarks"), nextRemarks);
  };

  const addRemark = () => {
    const newRemark: YupStockInItemRemarkCreateEdit = { remark: "" };
    setRemarksValue([...remarks, newRemark]);
  };

  const removeRemark = (remarkIndex: number) => {
    const nextRemarks = remarks.filter((_, idx) => idx !== remarkIndex);
    setRemarksValue(nextRemarks);
  };

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
            <Stack spacing={2}>
              {remarks.length === 0 && (
                <Typography color="text.secondary">
                  {t("no-remarks")}
                </Typography>
              )}

              {remarks.map((remark, remarkIndex) => (
                <Stack
                  key={
                    remark.id ??
                    remark.stockInItemId ??
                    `${itemIndex}-${remarkIndex}`
                  }
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                >
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    id={remarksFieldName(remarkIndex)}
                    name={remarksFieldName(remarkIndex)}
                    value={remark.remark ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      getRemarkTouched(remarkIndex) &&
                      Boolean(getRemarkError(remarkIndex))
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={getRemarkTouched(remarkIndex)}
                        error={getRemarkError(remarkIndex)}
                        translatedFieldName={t("remark")}
                      />
                    }
                  />
                  <IconButton
                    aria-label={t("remove-remark")}
                    onClick={() => removeRemark(remarkIndex)}
                    color="error"
                    size="small"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addRemark}
                size="small"
              >
                {t("add-remark")}
              </Button>
            </Stack>
          </Box>
        </PbTabPanel>
      </PbCard>
    </PageSection>
  );
};

export default StockInItemCreateEdit;
