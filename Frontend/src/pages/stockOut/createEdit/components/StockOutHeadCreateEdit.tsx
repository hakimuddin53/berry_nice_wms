import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { useWarehouseService } from "services/WarehouseService";
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
      ]}
    ></DataList>
  );
};

export default StockOutHeadCreateEdit;
