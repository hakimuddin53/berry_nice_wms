import { guid } from "types/guid";

export interface InvoiceItemCreateUpdateDto {
  id?: guid;
  productId?: guid | null;
  productCode?: string | null;
  primarySerialNumber?: string | null;
  manufactureSerialNumber?: string | null;
  imei?: string | null;
  warrantyDurationMonths?: number;
  unitOfMeasure?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  status?: string | null;
}
