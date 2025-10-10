import { guid } from "types/guid";

export interface ProductDetailsDto {
  productId: guid;
  productCode: string;

  // Foreign keys
  categoryId: guid;
  brandId?: guid;
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

  lowQty: number;
  createdDate: string;
}
