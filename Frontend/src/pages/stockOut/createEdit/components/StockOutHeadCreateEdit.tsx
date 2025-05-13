import { FormControl, FormHelperText, TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocationService } from "services/LocationService";
import { useWarehouseService } from "services/WarehouseService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  StockOutCreateEditSchema,
  YupStockOutCreateEdit,
} from "../yup/StockOutCreateEditSchema";

const StockOutHeadCreateEdit = (props: {
  formik: FormikProps<YupStockOutCreateEdit>;
}) => {
  const { t } = useTranslation();
  const formik = props.formik;

  const WarehouseService = useWarehouseService();
  const LocationService = useLocationService();

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("doNumber"),
          required: isRequiredField(StockOutCreateEditSchema, "doNumber"),
          value: (
            <TextField
              fullWidth
              id="doNumber"
              name="doNumber"
              size="small"
              value={formik.values.doNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.doNumber && Boolean(formik.errors.doNumber)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.doNumber}
                  error={formik.errors.doNumber}
                  translatedFieldName={t("doNumber")}
                />
              }
            />
          ),
        },
        {
          label: t("warehouse"),
          required: isRequiredField(
            StockOutCreateEditSchema,
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
          label: t("rack"),
          required: isRequiredField(
            StockOutCreateEditSchema,
            "locationId",
            formik.values
          ),
          value: (
            <FormControl
              fullWidth
              error={
                formik.touched.locationId && Boolean(formik.errors.locationId)
              }
            >
              <SelectAsync2
                name="locationId"
                error={
                  formik.touched.locationId && Boolean(formik.errors.locationId)
                }
                onBlur={() => formik.setFieldTouched("locationId")}
                ids={useMemo(
                  () =>
                    formik.values.locationId ? [formik.values.locationId] : [],
                  [formik.values.locationId]
                )}
                onSelectionChange={async (newOption) => {
                  formik.setFieldValue("locationId", newOption?.value || null);
                }}
                asyncFunc={(
                  input: string,
                  page: number,
                  pageSize: number,
                  ids?: guid[]
                ) =>
                  LocationService.getSelectOptions(input, page, pageSize, ids)
                }
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                <FormikErrorMessage
                  touched={formik.touched.locationId}
                  error={formik.errors.locationId}
                  translatedFieldName={t("rack")}
                />
              </FormHelperText>
            </FormControl>
          ),
        },
      ]}
    ></DataList>
  );
};

export default StockOutHeadCreateEdit;
