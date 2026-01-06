import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import * as yup from "yup";

export const UserRoleCreateEditSchema = yup.object({
  name: yup.string().required(),
  module: yup
    .array()
    .of(yup.mixed<ModuleEnum>().oneOf(Object.values(ModuleEnum))) // Ensure each value is a valid ModuleEnum value
    .required()
    .min(1, "At least one module must be selected"), // Optional: add a minimum length validation
});

export type YupUserRoleCreateEdit = yup.InferType<
  typeof UserRoleCreateEditSchema
>;
