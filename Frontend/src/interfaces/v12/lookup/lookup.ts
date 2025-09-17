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
  Color = "Color",
  Storage = "Storage",
  Ram = "Ram",
  Processor = "Processor",
  Year = "Year",
  Brand = "Brand",
  Model = "Model",
}

export interface LookupDetailsDto {
  id: string;
  groupKey: LookupGroupKey;
  label: string;
  sortOrder: number;
  isActive: boolean;
  metaJson?: string | null;
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
  metaJson?: string | null;
}

export interface LookupSearchDto extends PagedRequestAbstractDto {
  groupKey: LookupGroupKey;
  search?: string;
  activeOnly: boolean;
}
