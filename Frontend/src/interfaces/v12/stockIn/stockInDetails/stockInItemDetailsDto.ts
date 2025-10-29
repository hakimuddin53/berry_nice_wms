import { guid } from "types/guid";
import { StockInItemRemarkDetailsDto } from "./stockInItemRemarkDetailsDto";

export interface StockInItemDetailsDto {
  id: guid;
  stockInId: guid;
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
  stockInItemRemarks?: StockInItemRemarkDetailsDto[];
  receiveQuantity: number;

  // Display fields
  productName?: string;
}
