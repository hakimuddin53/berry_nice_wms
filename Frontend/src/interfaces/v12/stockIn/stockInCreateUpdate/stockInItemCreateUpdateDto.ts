import { guid } from "types/guid";

export interface StockInItemCreateUpdateDto {
  productId?: guid;
  productCode: string;
  categoryId: guid;
  brandId?: guid;
  model?: string;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  locationId: guid;
  primarySerialNumber?: string;
  manufactureSerialNumber?: string;
  region?: string;
  newOrUsed?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  // Free-text, comma-delimited remark(s)
  remark?: string;
  internalRemark?: string;
  receiveQuantity: number;
}
