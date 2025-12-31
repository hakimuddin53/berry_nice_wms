export interface StockTakeCreateDto {
  warehouseId: string;
  remark?: string;
  items: StockTakeCreateItemDto[];
}

export interface StockTakeCreateItemDto {
  productId?: string | null;
  scannedBarcode?: string | null;
  countedQuantity: number;
  remark?: string;
}
