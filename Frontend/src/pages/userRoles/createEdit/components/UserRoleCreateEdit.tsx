import {
  Autocomplete,
  AutocompleteGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  FormControl,
  TextField,
} from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync2";
import { FormikProps } from "formik";
import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCartonSizeService } from "services/CartonSizeService";
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

  const CartonSizeService = useCartonSizeService();

  const [options, setOptions] = useState<SelectAsyncOption[]>([]);

  useEffect(() => {
    CartonSizeService.getSelectOptions("", 1, 100)
      .then((userRole) => setOptions(userRole))
      .catch((err) => {});
  }, [CartonSizeService]);

  // Handler with typed arguments
  const handleSelectionChange = (
    event: React.SyntheticEvent,
    newValue: SelectAsyncOption[]
  ) => {
    formik.setFieldValue(
      "cartonSizeId",
      newValue.map((x) => x.value)
    );
  };

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
      <DataList
        hideDevider={true}
        md={12}
        data={[
          {
            label: t("cartonSize"),
            value: (
              <Autocomplete<SelectAsyncOption, true, undefined, undefined>
                multiple
                fullWidth
                id="multiple-limit-tags-chip-typed"
                options={options}
                getOptionLabel={(option: SelectAsyncOption) =>
                  `${option.label} (${option.value})`
                }
                value={formik.values.cartonSizeId
                  ?.map((id) => options.find((option) => option.value === id))
                  .filter(
                    (option): option is SelectAsyncOption =>
                      option !== undefined
                  )}
                onChange={handleSelectionChange}
                isOptionEqualToValue={(
                  option: SelectAsyncOption,
                  value: SelectAsyncOption
                ) =>
                  option.label === value.label && option.value === value.value
                }
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField {...params} variant="outlined" />
                )}
                renderTags={(
                  value: readonly SelectAsyncOption[],
                  getTagProps: AutocompleteGetTagProps
                ): React.ReactNode =>
                  value.map((option: SelectAsyncOption, index: number) => (
                    <Chip
                      label={`${option.label}`}
                      {...getTagProps({ index })}
                      variant="outlined"
                      size="small"
                    />
                  ))
                }
              />
            ),
          },
        ]}
      ></DataList>
    </>
  );
};

export default UserRoleCreateEdit;
