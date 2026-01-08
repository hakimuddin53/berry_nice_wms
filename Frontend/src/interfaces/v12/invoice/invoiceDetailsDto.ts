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
  salesTypeId?: guid | null;
  salesTypeName?: string | null;
  paymentTypeId?: guid | null;
  paymentTypeName?: string | null;
  paymentReference?: string | null;
  remark?: string | null;
  grandTotal: number;
  warehouseId: guid;
  warehouseLabel?: string | null;
  createdAt?: string;
  createdById?: string;
  changedAt?: string | null;
  changedById?: string | null;
  invoiceItems: InvoiceItemDetailsDto[];
}
