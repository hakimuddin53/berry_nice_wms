import { FormikErrors, getIn } from "formik";

export const isRequiredField = (
  validationSchema: any,
  name: string,
  formValues?: any
) => {
  name = name.replaceAll("[]", ".innerType.fields");
  return (
    !getIn(
      validationSchema.describe(formValues ? { value: formValues } : null)
        .fields,
      name
    )?.optional ?? true
  );
};

export const formikObjectHasHeadTouchedErrors = (
  errors: any,
  touched: any
): boolean => {
  let hasTouchedHeadError = false;
  Object.keys(errors).forEach((key, index) => {
    if (typeof errors[key] === "string" && touched[key]) {
      hasTouchedHeadError = true;
    }
  });
  return hasTouchedHeadError;
};

export const getFormikArrayElementErrors = <T>(
  errorArray: FormikErrors<T>[] | string | string[] | undefined,
  index: number
): FormikErrors<T> => {
  const element: FormikErrors<T> | string = errorArray?.[index] || {};
  if (typeof element === "string") return {};
  return element;
};

export const formikObjectHasTouchedErrors = (
  errors: any,
  touched: any
): boolean => {
  if (!errors || !touched) {
    return false;
  }
  try {
    if (typeof errors === "object") {
      Object.keys(errors).forEach((key, index) => {
        if (formikObjectHasTouchedErrors(errors[key], touched[key])) {
          throw new Error("Break");
        }
      });
    } else if (typeof errors === "string") {
      if (touched) {
        throw new Error("Break");
      }
    } else {
      throw new Error("unknown object type " + typeof errors);
    }
  } catch (e: any) {
    if (e.message !== "Break") throw e;
    return true;
  }
  return false;
};
