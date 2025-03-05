import { TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isRequiredField } from "utils/formikHelpers";
import {
  UserCreateEditSchema,
  YupUserCreateEdit,
} from "../yup/UserCreateEditSchema";

const UserCreateEdit = (props: { formik: FormikProps<YupUserCreateEdit> }) => {
  const { t } = useTranslation();

  const formik = props.formik;

  return (
    <DataList
      hideDevider={true}
      data={[
        {
          label: t("name"),
          required: isRequiredField(UserCreateEditSchema, "name"),
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
          label: t("email"),
          required: isRequiredField(UserCreateEditSchema, "email"),
          value: (
            <TextField
              fullWidth
              id="email"
              name="email"
              size="small"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.email}
                  error={formik.errors.email}
                  translatedFieldName={t("email")}
                />
              }
            />
          ),
        },
        {
          label: t("password"),
          required: isRequiredField(UserCreateEditSchema, "password"),
          value: (
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              size="small"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.password}
                  error={formik.errors.password}
                  translatedFieldName={t("password")}
                />
              }
            />
          ),
        },
        {
          label: t("confirmPassword"),
          required: isRequiredField(UserCreateEditSchema, "confirmPassword"),
          value: (
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              type="confirmPassword"
              size="small"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                <FormikErrorMessage
                  touched={formik.touched.confirmPassword}
                  error={formik.errors.confirmPassword}
                  translatedFieldName={t("confirmPassword")}
                />
              }
            />
          ),
        },
        {
          label: t("userRole"),
          value: (
            <SelectAsync2
              name="userRoleId"
              ids={useMemo(
                () =>
                  formik.values.userRoleId ? [formik.values.userRoleId] : [],
                [formik.values.userRoleId]
              )}
              onSelectionChange={async (newOption) => {
                formik.setFieldValue("userRoleId", newOption?.value || null);
              }}
              asyncFunc={(
                input: string,
                page: number,
                pageSize: number,
                ids?: guid[]
              ) => CategoryService.getSelectOptions(input, page, pageSize, ids)}
            />
          ),
        },
      ]}
    ></DataList>
  );
};

export default UserCreateEdit;
