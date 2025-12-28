import { guid } from "types/guid";

export interface InvoicedProductReportRowDto {
  invoiceId: guid;
  invoiceNumber: string;
  dateOfSale: string;
  productId?: guid | null;
  productCode: string;
  model?: string | null;
  warehouseId?: guid | null;
  warehouseLabel?: string | null;
  locationId?: guid | null;
  locationLabel?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoicedProductReportSearchDto {
  search?: string | null;
  productId?: guid | null;
  model?: string | null;
  warehouseId?: guid | null;
  locationId?: guid | null;
  categoryId?: guid | null;
  brandId?: guid | null;
  colorId?: guid | null;
  storageId?: guid | null;
  ramId?: guid | null;
  processorId?: guid | null;
  screenSizeId?: guid | null;
  gradeId?: guid | null;
  regionId?: guid | null;
  newOrUsedId?: guid | null;
  fromDate?: string | null;
  toDate?: string | null;
  page: number;
  pageSize: number;
}
