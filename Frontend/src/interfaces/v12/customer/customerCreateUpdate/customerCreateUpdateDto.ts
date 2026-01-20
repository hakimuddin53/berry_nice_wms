import { guid } from "types/guid";

export interface CustomerCreateUpdateDto {
  customerCode?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customerTypeId: guid;
}
