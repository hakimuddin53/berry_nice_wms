import { guid } from "types/guid";
import { StockInItemRemarkDetailsDto } from "./stockInItemRemarkDetailsDto";

export interface StockInItemDetailsDto {
  id: guid;
  stockInId: guid;
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
  condition?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  stockInItemRemarks?: StockInItemRemarkDetailsDto[];
  itemsIncluded?: string;
  receiveQuantity: number;

  // Display fields
  productName?: string;
}
