import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import SelectAsync2, {
  SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSupplierService } from "services/SupplierService";
import { isRequiredField } from "utils/formikHelpers";
import {
  StockRecieveCreateEditSchema,
  YupStockRecieveCreateEdit,
} from "../yup/StockRecieveCreateEditSchema";

const StockRecieveHeadCreateEdit = (props: {
  formik: FormikProps<YupStockRecieveCreateEdit>;
}) => {
  const { t } = useTranslation("common");
  const formik = props.formik;
  const supplierService = useSupplierService();

  const sellerInfoIds = useMemo(
    () => (formik.values.sellerInfo?.trim() ? [formik.values.sellerInfo] : []),
    [formik.values.sellerInfo]
  );

  const purchaserIds = useMemo(() => [] as string[], []);

  const createStaticOptions = useCallback((ids?: string[]) => {
    if (!ids || ids.length === 0) {
      return [] as SelectAsyncOption[];
    }

    return ids
      .filter((value) => !!value)
      .map(
        (value) =>
          ({
            label: value,
            value,
          } as SelectAsyncOption)
      );
  }, []);

  const normalizeOptions = useCallback((options: SelectAsyncOption[] = []) => {
    return options.map(
      (option) =>
        ({
          label: option.label ?? "",
          value: option.label ?? "",
        } as SelectAsyncOption)
    );
  }, []);

  const supplierAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      if (ids && ids.length > 0) {
        return createStaticOptions(ids);
      }

      const options = await supplierService.getSelectOptions(
        input,
        page,
        pageSize
      );
      return normalizeOptions(options);
    },
    [createStaticOptions, normalizeOptions, supplierService]
  );

  const userAsync = useCallback(async () => [] as SelectAsyncOption[], []);

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("seller-info"),
          required: isRequiredField(
            StockRecieveCreateEditSchema,
            "sellerInfo",
            formik.values
          ),
          value: (
            <SelectAsync2
              name="sellerInfo"
              placeholder={t("seller-info")}
              ids={sellerInfoIds}
              asyncFunc={supplierAsync}
              suggestionsIfEmpty
              onSelectionChange={(option?: SelectAsyncOption) =>
                formik.setFieldValue("sellerInfo", option?.value ?? "")
              }
              onBlur={() => formik.setFieldTouched("sellerInfo", true)}
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
        // Purchaser removed: set automatically to current user in page logic
        {
          label: t("date-of-purchase"),
          required: isRequiredField(
            StockRecieveCreateEditSchema,
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
            StockRecieveCreateEditSchema,
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

export default StockRecieveHeadCreateEdit;
