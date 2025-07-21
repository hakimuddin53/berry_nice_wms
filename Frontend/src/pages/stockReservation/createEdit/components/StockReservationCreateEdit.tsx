import { FormControl, FormHelperText, TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProductService } from "services/ProductService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  StockReservationCreateEditSchema,
  YupStockReservationCreateEdit,
} from "../yup/StockReservationCreateEditSchema";

const StockReservationCreateEdit = (props: {
  formik: FormikProps<YupStockReservationCreateEdit>;
}) => {
  const { t } = useTranslation();

  const ProductService = useProductService();
  const formik = props.formik;

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("number"),
          required: isRequiredField(StockReservationCreateEditSchema, "number"),
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
          label: t("product"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "productId",
            formik.values
          ),
          value: (
            <FormControl
              fullWidth
              error={
                formik.touched.productId && Boolean(formik.errors.productId)
              }
            >
              <SelectAsync2
                name="productId"
                error={
                  formik.touched.productId && Boolean(formik.errors.productId)
                }
                onBlur={() => formik.setFieldTouched("productId")}
                ids={useMemo(
                  () =>
                    formik.values.productId ? [formik.values.productId] : [],
                  [formik.values.productId]
                )}
                onSelectionChange={async (newOption) => {
                  formik.setFieldValue("productId", newOption?.value || null);
                }}
                asyncFunc={(
                  input: string,
                  page: number,
                  pageSize: number,
                  ids?: guid[]
                ) =>
                  ProductService.getSelectOptions(input, page, pageSize, ids)
                }
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                <FormikErrorMessage
                  touched={formik.touched.productId}
                  error={formik.errors.productId}
                  translatedFieldName={t("product")}
                />
              </FormHelperText>
            </FormControl>
          ),
        },
        {
          label: t("quantity"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "quantity"
          ),
          value: (
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              type="number"
              size="small"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.quantity}
                  error={formik.errors.quantity}
                  translatedFieldName={t("quantity")}
                />
              }
            />
          ),
        },
        {
          label: t("quantity"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "quantity"
          ),
          value: (
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              type="number"
              size="small"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.quantity}
                  error={formik.errors.quantity}
                  translatedFieldName={t("quantity")}
                />
              }
            />
          ),
        },
      ]}
    ></DataList>
  );
};

export default StockReservationCreateEdit;
