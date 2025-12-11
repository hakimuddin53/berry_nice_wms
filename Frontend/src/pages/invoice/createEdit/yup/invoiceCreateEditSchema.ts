import { guid } from "types/guid";
import * as yup from "yup";

export interface YupInvoiceItemCreateEdit {
  id?: guid;
  productId?: guid | null;
  productCode?: string | null;
  imei?: string | null;
  warrantyDurationMonths?: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  warrantyExpiryDate?: string | null;
}

export interface YupInvoiceCreateEdit {
  customerId?: guid | null;
  customerName?: string | null;
  dateOfSale: string;
  salesPersonId: string;
  warehouseId: guid;
  salesTypeId?: guid | null;
  paymentTypeId?: guid | null;
  paymentReference?: string | null;
  remark?: string | null;
  invoiceItems: YupInvoiceItemCreateEdit[];
}

const invoiceItemSchema = yup.object().shape({
  id: yup.string().nullable(),
  productId: yup.string().nullable(),
  productCode: yup.string().nullable(),
  imei: yup.string().required(),
  warrantyDurationMonths: yup.number().min(0).nullable().required(),
  quantity: yup.number().min(1).required(),
  unitPrice: yup.number().min(0).required(),
  totalPrice: yup.number().min(0).nullable(),
  warrantyExpiryDate: yup.string().nullable(),
});

export const invoiceCreateEditSchema = yup.object().shape({
  customerId: yup.string().nullable(),
  customerName: yup.string().nullable(),
  dateOfSale: yup.string().required(),
  salesPersonId: yup.string().required(),
  warehouseId: yup.string().required(),
  salesTypeId: yup.string().nullable(),
  paymentTypeId: yup.string().nullable(),
  paymentReference: yup.string().nullable(),
  remark: yup.string().nullable(),
  invoiceItems: yup.array().of(invoiceItemSchema).min(1).required(),
});
