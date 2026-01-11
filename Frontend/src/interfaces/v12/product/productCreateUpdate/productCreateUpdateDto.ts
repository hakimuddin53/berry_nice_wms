import { guid } from "types/guid";

export interface ProductCreateUpdateDto {
  productCode: string;

  // Foreign keys to Lookup table
  categoryId: guid;
  brandId?: guid;
  model?: string;
  year?: number;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  gradeId?: guid;

  lowQty: number;
}
