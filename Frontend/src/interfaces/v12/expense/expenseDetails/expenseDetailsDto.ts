import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface ExpenseDetailsDto extends CreatedChangedEntity {
  id: guid;
  description: string;
  amount: number;
  category: string; // Freight, Internet, Staff Refreshment, etc.
  remark?: string;
}

export interface ExpenseFindByParametersDto {
  expenseIds: guid[];
  page: number;
  pageSize: number;
}
