export interface StockTransferDetailsDto {
  id: string;
  number: string;
  productId: string;
  productCode?: string;
  quantityTransferred: number;
  fromWarehouseId: string;
  fromWarehouseName?: string;
  toWarehouseId: string;
  toWarehouseName?: string;
  createdAt: string;
}
