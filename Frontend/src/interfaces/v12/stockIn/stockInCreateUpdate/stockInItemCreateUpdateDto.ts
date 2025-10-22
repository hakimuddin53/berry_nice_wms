import { guid } from "types/guid";
import { StockInItemRemarkCreateUpdateDto } from "./stockInItemRemarkCreateUpdateDto";

export interface StockInItemCreateUpdateDto {
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
  condition?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  stockInItemRemarks?: StockInItemRemarkCreateUpdateDto[];
  itemsIncluded?: string;
  receiveQuantity: number;
}
