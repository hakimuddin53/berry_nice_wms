import { guid } from "types/guid";

export interface ProductCreateUpdateDto {
  sku: string;

  // Foreign keys to Lookup table
  categoryId: guid;
  brandId?: guid;
  modelId?: guid;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;

  hasSerial: boolean;

  // Embedded prices
  retailPrice: number;
  dealerPrice: number;
  agentPrice: number;

  lowQty: number;
}
