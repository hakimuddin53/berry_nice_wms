import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface SupplierDetailsDto extends CreatedChangedEntity {
  id: guid;
  supplierCode: string;
  name: string;
  ic?: string;
  taxId?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  contactNo?: string;
  email?: string;
}

export interface SupplierFindByParametersDto {
  supplierIds: guid[];
  page: number;
  pageSize: number;
}
