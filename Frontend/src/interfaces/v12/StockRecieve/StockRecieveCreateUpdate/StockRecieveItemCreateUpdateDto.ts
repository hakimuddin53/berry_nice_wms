import { guid } from "types/guid";

export interface StockRecieveItemCreateUpdateDto {
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
  grade: string;
  locationId: guid;
  imeiSerialNumber?: string;
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
