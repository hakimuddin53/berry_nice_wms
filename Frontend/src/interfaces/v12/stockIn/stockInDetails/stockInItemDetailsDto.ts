import { guid } from "types/guid";

export interface StockInItemDetailsDto {
  id: guid;
  stockInId: guid;
  productId: guid;
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
  // Aggregated, free-text remark(s)
  remark?: string;
  internalRemark?: string;
  receiveQuantity: number;

  // Display fields
  productName?: string;
}
