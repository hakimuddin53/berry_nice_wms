export interface StockTakeDetailsDto {
  id: string;
  number: string;
  warehouseId: string;
  warehouseName?: string;
  takenAt: string;
  remark?: string;
  items: StockTakeItemDetailsDto[];
}

export interface StockTakeItemDetailsDto {
  id: string;
  productId?: string | null;
  productCode?: string;
  countedQuantity: number;
  systemQuantity: number;
  differenceQuantity: number;
  scannedBarcode?: string | null;
  remark?: string;
}
