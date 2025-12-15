import { guid } from "types/guid";

export interface InvoiceItemCreateUpdateDto {
  id?: guid;
  productId?: guid | null;
  locationId?: guid | null;
  warrantyDurationMonths?: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  warrantyExpiryDate?: string | null;
}
