import { guid } from "types/guid";

export interface StockRecieveItemCreateUpdateDto {
  productId?: guid;
  productCode: string;
  categoryId: guid;
  brandId?: guid;
  modelId?: guid;
  year?: number;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  gradeId: guid;
  batteryHealth?: number;
  locationId: guid;
  serialNumber?: string;
  regionId?: guid;
  newOrUsedId?: guid;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  // Free-text, comma-delimited remark(s)
  remark?: string;
  internalRemark?: string;
  receiveQuantity: number;
}
