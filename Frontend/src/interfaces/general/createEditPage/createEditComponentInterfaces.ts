import { FormikErrors, FormikTouched } from "formik";

export interface EntityCreateEditComponentProps<T> {
  elementKey: any;
  handleChange: any;
  handleBlur: any;
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  formik: any;
}

export interface EntityCreateEditLocationComponentProps<T> {
  elementKey: any;
  handleChange: any;
  handleBlur: any;
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  formik: any;
  locationId: string;
}

export interface EntityCreateEditChildComponentProps<T>
  extends EntityCreateEditComponentProps<T> {
  parentElementName: string;
  parentElementIndex: number;
}

export interface EntityCreateEditChildLocationComponentProps<T>
  extends EntityCreateEditComponentProps<T> {
  parentElementName: string;
  parentElementIndex: number;
  locationId: string;
}

export interface EntityCreateEditChildLocationMaterialQuantitiesCreateEditProps<
  T
> extends EntityCreateEditChildLocationComponentProps<T> {
  materialId: string | undefined | null;
}
