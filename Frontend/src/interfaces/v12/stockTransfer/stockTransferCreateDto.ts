export interface StockTransferCreateDto {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: StockTransferCreateItemDto[];
}

export interface StockTransferCreateItemDto {
  productId: string;
  quantity: number;
  remark?: string;
}
