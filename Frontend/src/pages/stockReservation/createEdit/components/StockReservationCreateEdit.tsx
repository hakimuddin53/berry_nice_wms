import { Chip, FormControl, FormHelperText, TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useWarehouseService } from "services/WarehouseService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import { getChipColor } from "../../../../constants";
import {
  StockReservationCreateEditSchema,
  YupStockReservationCreateEdit,
} from "../yup/StockReservationCreateEditSchema";

const StockReservationCreateEdit = (props: {
  formik: FormikProps<YupStockReservationCreateEdit>;
}) => {
  const { t } = useTranslation();

  const WarehouseService = useWarehouseService();
  const formik = props.formik;

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("warehouse"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "warehouseId",
            formik.values
          ),
          value: (
            <FormControl
              fullWidth
              error={
                formik.touched.warehouseId && Boolean(formik.errors.warehouseId)
              }
            >
              <SelectAsync2
                name="warehouseId"
                error={
                  formik.touched.warehouseId &&
                  Boolean(formik.errors.warehouseId)
                }
                onBlur={() => formik.setFieldTouched("warehouseId")}
                ids={useMemo(
                  () =>
                    formik.values.warehouseId
                      ? [formik.values.warehouseId]
                      : [],
                  [formik.values.warehouseId]
                )}
                onSelectionChange={async (newOption) => {
                  formik.setFieldValue("warehouseId", newOption?.value || null);
                }}
                asyncFunc={(
                  input: string,
                  page: number,
                  pageSize: number,
                  ids?: guid[]
                ) =>
                  WarehouseService.getSelectOptions(input, page, pageSize, ids)
                }
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                <FormikErrorMessage
                  touched={formik.touched.warehouseId}
                  error={formik.errors.warehouseId}
                  translatedFieldName={t("warehouse")}
                />
              </FormHelperText>
            </FormControl>
          ),
        },
        {
          label: t("reserved-at"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "reservedAt"
          ),
          value: (
            <TextField
              fullWidth
              id="reservedAt"
              name="reservedAt"
              size="small"
              disabled={true}
              value={formik.values.reservedAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.reservedAt && Boolean(formik.errors.reservedAt)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.reservedAt}
                  error={formik.errors.reservedAt}
                  translatedFieldName={t("reserved-at")}
                />
              }
            />
          ),
        },
        {
          label: t("expires-at"),
          required: isRequiredField(
            StockReservationCreateEditSchema,
            "expiresAt"
          ),
          value: (
            <TextField
              fullWidth
              id="expiresAt"
              name="expiresAt"
              size="small"
              disabled={true}
              value={formik.values.expiresAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.expiresAt && Boolean(formik.errors.expiresAt)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.expiresAt}
                  error={formik.errors.expiresAt}
                  translatedFieldName={t("expires-at")}
                />
              }
            />
          ),
        },
        {
          label: t("status"),
          required: isRequiredField(StockReservationCreateEditSchema, "status"),
          value: (
            <Chip
              label={t(formik.values.status)}
              color={getChipColor(formik.values.status)}
              size="small"
            />
          ),
        },
      ]}
    ></DataList>
  );
};

export default StockReservationCreateEdit;
