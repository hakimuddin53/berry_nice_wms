import { guid } from "types/guid";

export interface InvoiceItemDetailsDto {
  id: guid;
  invoiceId: guid;
  productId?: guid | null;
  productCode?: string | null;
  description?: string | null;
  primarySerialNumber?: string | null;
  manufactureSerialNumber?: string | null;
  imei?: string | null;
  warrantyDurationMonths: number;
  unitOfMeasure?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status?: string | null;
}
