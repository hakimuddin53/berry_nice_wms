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
  remark?: string | null;

  // Display helpers returned by API
  productCode?: string | null;
  productName?: string | null;
  brand?: string | null;
  model?: string | null;
  locationName?: string | null;
  locationLabel?: string | null;
}
