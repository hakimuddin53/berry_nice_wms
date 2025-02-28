import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { isRequiredField } from "utils/formikHelpers";
import {
  DesignCreateEditSchema,
  YupDesignCreateEdit,
} from "../yup/DesignCreateEditSchema";

const DesignCreateEdit = (props: {
  formik: FormikProps<YupDesignCreateEdit>;
}) => {
  const { t } = useTranslation();

  const formik = props.formik;

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("number"),
          required: isRequiredField(DesignCreateEditSchema, "name"),
          value: (
            <TextField
              fullWidth
              id="name"
              name="name"
              size="small"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.name}
                  error={formik.errors.name}
                  translatedFieldName={t("name")}
                />
              }
            />
          ),
        },
      ]}
    ></DataList>
  );
};

export default DesignCreateEdit;
