import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { isRequiredField } from "utils/formikHelpers";
import {
  LookupCreateEditSchema,
  YupLookupCreateEdit,
} from "../yup/LookupCreateEditSchema";

const LookupCreateEdit = ({
  formik,
}: {
  formik: FormikProps<YupLookupCreateEdit>;
}) => {
  const { t } = useTranslation();
  return (
    <DataList
      hideDevider
      data={[
        {
          label: t("label"),
          required: isRequiredField(LookupCreateEditSchema, "label"),
          value: (
            <TextField
              fullWidth
              size="small"
              id="label"
              name="label"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.label && Boolean(formik.errors.label)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.label}
                  error={formik.errors.label}
                  translatedFieldName={t("label")}
                />
              }
            />
          ),
        },
      ]}
    />
  );
};
export default LookupCreateEdit;
