import { guid } from "types/guid";
import { InvoiceItemCreateUpdateDto } from "./invoiceItemCreateUpdateDto";

export interface InvoiceCreateUpdateDto {
  customerId?: guid | null;
  customerName?: string | null;
  dateOfSale: string;
  salesPersonId: string;
  eOrderNumber?: string | null;
  salesTypeId?: guid | null;
  paymentTypeId?: guid | null;
  paymentReference?: string | null;
  remark?: string | null;
  invoiceItems: InvoiceItemCreateUpdateDto[];
}
