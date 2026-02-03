import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

// interfaces/v12/lookup/lookup.ts
export enum LookupGroupKey {
  CustomerType = "CustomerType",
  SalesType = "SalesType",
  PaymentType = "PaymentType",
  Location = "Location",
  Region = "Region",
  NewOrUsed = "NewOrUsed",
  InventoryStatus = "InventoryStatus",
  ProductCategory = "ProductCategory",
  ExpenseCategory = "ExpenseCategory",
  UserRole = "UserRole",
  ScreenSize = "ScreenSize",
  Grade = "Grade",
  Color = "Color",
  Storage = "Storage",
  Ram = "Ram",
  Processor = "Processor",
  Year = "Year",
  Brand = "Brand",
  Model = "Model",
  Warehouse = "Warehouse",
  Remark = "Remark",
  LogbookStatus = "LogbookStatus",
}

export interface LookupDetailsDto {
  id: string;
  groupKey: LookupGroupKey;
  label: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  changedAt?: string;
  createdById?: string;
  changedById?: string;
}

export interface LookupCreateUpdateDto {
  groupKey: LookupGroupKey;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LookupSearchDto extends PagedRequestAbstractDto {
  groupKey: LookupGroupKey;
  search?: string;
  activeOnly: boolean;
}
