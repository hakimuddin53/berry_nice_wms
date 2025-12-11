import { guid } from "types/guid";

export interface StockRecieveItemDetailsDto {
  id: guid;
  StockRecieveId: guid;
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
  imeiSerialNumber?: string;
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

