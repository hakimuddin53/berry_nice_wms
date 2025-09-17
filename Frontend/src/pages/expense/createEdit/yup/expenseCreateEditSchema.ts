import { guid } from "types/guid";
import * as yup from "yup";

export const expenseCreateEditSchema = yup.object({
  description: yup.string().required(),
  amount: yup.number().required().positive(),
  category: yup.string().required(),
  remark: yup.string().optional(),
});

export type YupExpenseCreateEdit = yup.InferType<
  typeof expenseCreateEditSchema
>;
