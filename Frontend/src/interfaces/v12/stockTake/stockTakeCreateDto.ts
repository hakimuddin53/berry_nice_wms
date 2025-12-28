export interface StockTakeCreateDto {
  warehouseId: string;
  remark?: string;
  items: StockTakeCreateItemDto[];
}

export interface StockTakeCreateItemDto {
  productId: string;
  countedQuantity: number;
  remark?: string;
}
