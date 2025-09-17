export interface ExpenseCreateUpdateDto {
  description: string;
  amount: number;
  category: string; // Freight, Internet, Staff Refreshment, etc.
  remark?: string;
}