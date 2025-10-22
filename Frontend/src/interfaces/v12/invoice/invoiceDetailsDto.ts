import { guid } from "types/guid";
import { InvoiceItemDetailsDto } from "./invoiceItemDetailsDto";

export interface InvoiceDetailsDto {
  id: guid;
  number: string;
  customerId?: guid | null;
  customerName?: string | null;
  dateOfSale: string;
  salesPersonId: string;
  salesPersonName?: string | null;
  eOrderNumber?: string | null;
  salesTypeId?: guid | null;
  salesTypeName?: string | null;
  paymentTypeId?: guid | null;
  paymentTypeName?: string | null;
  paymentReference?: string | null;
  remark?: string | null;
  grandTotal: number;
  invoiceItems: InvoiceItemDetailsDto[];
}
