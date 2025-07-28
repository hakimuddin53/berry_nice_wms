import { guid } from "types/guid";

export interface StockInCreateUpdateDto {
  number?: string | null;
  poNumber: string;
  jsNumber: string;
  warehouseId: guid;
  fromLocation: string;
  stockInItems: StockInItemCreateUpdate[] | null;
}
export interface StockInItemCreateUpdate {
  productId: guid;
  quantity: number;
  locationId: guid;
  unitPrice: number;
}
