import { guid } from "types/guid";

export interface StockRecieveItemDetailsDto {
  id: guid;
  StockRecieveId: guid;
  productId: guid;
  productCode: string;
  categoryId: guid;
  brandId?: guid;
  modelId?: guid;
  modelName?: string;
  year?: number;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  gradeId?: guid;
  // Display-friendly grade label from lookup
  gradeName?: string;
  batteryHealth?: number;
  locationId: guid;
  locationName?: string;
  locationLabel?: string;
  serialNumber?: string;
  regionId?: guid;
  regionName?: string;
  newOrUsedId?: guid;
  newOrUsedName?: string;
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
