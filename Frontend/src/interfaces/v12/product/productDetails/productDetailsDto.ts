import { guid } from "types/guid";

export interface ProductDetailsDto {
  productId: guid;
  sku: string;

  // Foreign keys
  categoryId: guid;
  brandId?: guid;
  modelId?: guid;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;

  // Display names from lookups
  category: string;
  brand?: string;
  model?: string;
  color?: string;
  storage?: string;
  ram?: string;
  processor?: string;
  screenSize?: string;

  hasSerial: boolean;

  // Embedded prices
  retailPrice: number;
  dealerPrice: number;
  agentPrice: number;

  lowQty: number;
  createdDate: string;
}
