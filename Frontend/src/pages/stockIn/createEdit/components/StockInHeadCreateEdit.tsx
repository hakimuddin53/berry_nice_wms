import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { FormikProps } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useTranslation } from "react-i18next";
import { isRequiredField } from "utils/formikHelpers";
import {
  stockInCreateEditSchema,
  YupStockInCreateEdit,
} from "../yup/stockInCreateEditSchema";

const StockInHeadCreateEdit = (props: {
  formik: FormikProps<YupStockInCreateEdit>;
}) => {
  const { t } = useTranslation("common");
  const formik = props.formik;

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("number"),
          required: isRequiredField(
            stockInCreateEditSchema,
            "number",
            formik.values
          ),
          value: (
            <TextField
              fullWidth
              id="number"
              name="number"
              size="small"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.number}
                  error={formik.errors.number}
                  translatedFieldName={t("number")}
                />
              }
            />
          ),
        },
        {
          label: t("seller-info"),
          required: isRequiredField(
            stockInCreateEditSchema,
            "sellerInfo",
            formik.values
          ),
          value: (
            <TextField
              fullWidth
              id="sellerInfo"
              name="sellerInfo"
              size="small"
              value={formik.values.sellerInfo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.sellerInfo && Boolean(formik.errors.sellerInfo)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.sellerInfo}
                  error={formik.errors.sellerInfo}
                  translatedFieldName={t("seller-info")}
                />
              }
            />
          ),
        },
        {
          label: t("purchaser"),
          required: isRequiredField(
            stockInCreateEditSchema,
            "purchaser",
            formik.values
          ),
          value: (
            <TextField
              fullWidth
              id="purchaser"
              name="purchaser"
              size="small"
              value={formik.values.purchaser}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.purchaser && Boolean(formik.errors.purchaser)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.purchaser}
                  error={formik.errors.purchaser}
                  translatedFieldName={t("purchaser")}
                />
              }
            />
          ),
        },
        {
          label: t("date-of-purchase"),
          required: isRequiredField(
            stockInCreateEditSchema,
            "dateOfPurchase",
            formik.values
          ),
          value: (
            <TextField
              fullWidth
              id="dateOfPurchase"
              name="dateOfPurchase"
              type="date"
              size="small"
              value={formik.values.dateOfPurchase}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.dateOfPurchase &&
                Boolean(formik.errors.dateOfPurchase)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.dateOfPurchase}
                  error={formik.errors.dateOfPurchase}
                  translatedFieldName={t("date-of-purchase")}
                />
              }
              InputLabelProps={{ shrink: true }}
            />
          ),
        },
        {
          label: t("warehouse"),
          required: isRequiredField(
            stockInCreateEditSchema,
            "warehouseId",
            formik.values
          ),
          value: (
            <LookupAutocomplete
              groupKey={LookupGroupKey.Warehouse}
              name="warehouseId"
              value={formik.values.warehouseId}
              onChange={(value) => formik.setFieldValue("warehouseId", value)}
              onBlur={() => formik.setFieldTouched("warehouseId", true)}
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
      ]}
    ></DataList>
  );
};

export default StockInHeadCreateEdit;
