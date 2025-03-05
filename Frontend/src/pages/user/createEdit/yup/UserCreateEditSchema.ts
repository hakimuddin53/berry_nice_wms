import { guid } from "types/guid";
import * as yup from "yup";

export const UserCreateEditSchema = yup.object({
  name: yup.string().required(),
  email: yup
    .string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Must be at least 6 characters")
    .max(255)
    .required("Required"),
  confirmPassword: yup.string().when("password", {
    is: (val: any) => (val && val.length > 0 ? true : false),
    then: (shema) =>
      shema.oneOf([yup.ref("password")], "Both password need to be the same"),
  }),

  userRoleId: yup.mixed<guid>().nullable(),
});

export type YupUserCreateEdit = yup.InferType<typeof UserCreateEditSchema>;
