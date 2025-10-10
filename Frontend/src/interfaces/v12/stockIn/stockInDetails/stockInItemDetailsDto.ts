import { guid } from "types/guid";

export interface StockInItemDetailsDto {
  id: guid;
  stockInId: guid;
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

  // Display fields
  productCode?: string;
  productName?: string;
}