import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import * as yup from "yup";

export const UserRoleCreateEditSchema = yup.object({
  name: yup.string().required(),
  module: yup
    .array()
    .of(yup.mixed<ModuleEnum>().oneOf(Object.values(ModuleEnum))) // Ensure each value is a valid ModuleEnum value
    .required()
    .min(1, "At least one module must be selected"), // Optional: add a minimum length validation
  cartonSizeId: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          "Invalid GUID format"
        )
    ) // Validate GUID format
    .notRequired(),
});

export type YupUserRoleCreateEdit = yup.InferType<
  typeof UserRoleCreateEditSchema
>;
