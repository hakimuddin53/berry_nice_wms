import * as yup from "yup";
import { guid } from "types/guid";

export interface YupInvoiceItemCreateEdit {
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

export interface YupInvoiceCreateEdit {
  customerId?: guid | null;
  customerName?: string | null;
  dateOfSale: string;
  salesPersonId: string;
  eOrderNumber?: string | null;
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
  primarySerialNumber: yup.string().nullable(),
  manufactureSerialNumber: yup.string().nullable(),
  imei: yup.string().nullable(),
  warrantyDurationMonths: yup.number().min(0).nullable(),
  unitOfMeasure: yup.string().nullable(),
  quantity: yup.number().min(1).required(),
  unitPrice: yup.number().min(0).required(),
  totalPrice: yup.number().min(0).nullable(),
  status: yup.string().nullable(),
});

export const invoiceCreateEditSchema = yup.object().shape({
  customerId: yup.string().nullable(),
  customerName: yup.string().nullable(),
  dateOfSale: yup.string().required(),
  salesPersonId: yup.string().required(),
  eOrderNumber: yup.string().nullable(),
  salesTypeId: yup.string().nullable(),
  paymentTypeId: yup.string().nullable(),
  paymentReference: yup.string().nullable(),
  remark: yup.string().nullable(),
  invoiceItems: yup.array().of(invoiceItemSchema).min(1).required(),
});
