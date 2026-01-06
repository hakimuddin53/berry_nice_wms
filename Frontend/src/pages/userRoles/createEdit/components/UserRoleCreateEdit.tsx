import { Autocomplete, Chip, FormControl, TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { FormikProps } from "formik";
import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import { useTranslation } from "react-i18next";
import { isRequiredField } from "utils/formikHelpers";
import {
  UserRoleCreateEditSchema,
  YupUserRoleCreateEdit,
} from "../yup/UserRoleCreateEditSchema";

const UserRoleCreateEdit = (props: {
  formik: FormikProps<YupUserRoleCreateEdit>;
}) => {
  const { t } = useTranslation();

  const formik = props.formik;

  return (
    <>
      <DataList
        hideDevider={true}
        md={12}
        data={[
          {
            label: t("name"),
            required: isRequiredField(UserRoleCreateEditSchema, "name"),
            value: (
              <TextField
                fullWidth
                id="name"
                name="name"
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
      <DataList
        hideDevider={true}
        md={12}
        data={[
          {
            label: t("module"),
            required: isRequiredField(UserRoleCreateEditSchema, "module"),
            value: (
              <FormControl
                fullWidth
                error={formik.touched.module && Boolean(formik.errors.module)}
              >
                <Autocomplete<ModuleEnum, true, false>
                  multiple
                  size="small"
                  id="module"
                  value={formik.values.module?.filter(
                    (item): item is string => item !== undefined
                  )}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("module", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  options={Object.values(ModuleEnum)}
                  getOptionLabel={(option) => t(option)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={t(option)}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        formik.touched.module && Boolean(formik.errors.module)
                      }
                      helperText={formik.touched.module && formik.errors.module}
                    />
                  )}
                />
              </FormControl>
            ),
          },
        ]}
      ></DataList>
    </>
  );
};

export default UserRoleCreateEdit;
