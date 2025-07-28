import { guid } from "types/guid";

export interface ProductCreateUpdateDto {
  name: string;
  itemCode: string;
  clientCodeId: guid;
  quantityPerCarton?: number | null;
  categoryId: guid;
  sizeId: guid;
  colourId: guid;
  designId: guid;
  cartonSizeId: guid;
  productPhotoUrl?: string | null;
  unitPrice: number;
  threshold?: number | null;
}
