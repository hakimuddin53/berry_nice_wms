import { guid } from "types/guid";

export interface StockInItemCreateUpdateDto {
  productId: guid;
  locationId: guid;
  primarySerialNumber?: string;
  manufactureSerialNumber?: string;
  region?: string;
  condition?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  remarks?: string;
  itemsIncluded?: string;
  receiveQuantity: number;
}