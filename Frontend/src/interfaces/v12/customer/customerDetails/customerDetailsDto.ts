import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface CustomerDetailsDto extends CreatedChangedEntity {
  id: guid;
  customerCode: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customerType: string; // Retail / Dealer / Agent
}

export interface CustomerFindByParametersDto {
  customerIds: guid[];
  page: number;
  pageSize: number;
}