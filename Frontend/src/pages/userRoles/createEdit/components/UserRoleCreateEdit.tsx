import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
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
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("name"),
          required: isRequiredField(UserRoleCreateEditSchema, "name"),
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
        {
          label: t("module"),
          required: isRequiredField(UserRoleCreateEditSchema, "module"),
          value: (
            <FormControl
              fullWidth
              error={formik.touched.clientCode && Boolean(formik.errors.module)}
            >
              <Select
                id="module"
                name="module"
                size="small"
                value={formik.values.module}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {Object.values(ModuleEnum).map((p) => (
                  <MenuItem value={p} key={p}>
                    {t(p, { ns: "enumerables" })}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                <FormikErrorMessage
                  touched={formik.touched.module}
                  error={formik.errors.module}
                  translatedFieldName={t("module")}
                />
              </FormHelperText>
            </FormControl>
          ),
        },
        {
          label: t("cartonSize"),
          value: (
            <SelectAsync2
              name="cartonSizeId"
              isMulti={true}
              ids={useMemo(
                () =>
                  formik.values.cartonSizeId
                    ? [formik.values.cartonSizeId]
                    : [],
                [formik.values.cartonSizeId]
              )}
              onSelectionChange={async (newOption) => {
                formik.setFieldValue("cartonSizeId", newOption?.value || null);
              }}
              asyncFunc={(
                input: string,
                page: number,
                pageSize: number,
                ids?: guid[]
              ) =>
                CartonSizeService.getSelectOptions(input, page, pageSize, ids)
              }
            />
          ),
        },
      ]}
    ></DataList>
  );
};

export default UserRoleCreateEdit;
