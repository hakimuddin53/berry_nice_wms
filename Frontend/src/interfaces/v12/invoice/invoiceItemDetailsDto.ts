import { guid } from "types/guid";

export interface InvoiceItemDetailsDto {
  id: guid;
  invoiceId: guid;
  productId?: guid | null;
  locationId?: guid | null;
  warrantyDurationMonths: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warrantyExpiryDate?: string | null;
}
