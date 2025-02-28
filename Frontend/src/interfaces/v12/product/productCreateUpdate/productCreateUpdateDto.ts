import { ClientCodeEnum } from "interfaces/enums/GlobalEnums";
import { guid } from "types/guid";

export interface ProductCreateUpdateDto {
  name: string;
  itemCode: string;
  clientCode: ClientCodeEnum;
  quantityPerCarton?: number | null;
  categoryId: guid;
  sizeId: guid;
  colourId: guid;
  designId: guid;
  cartonSizeId: guid;
  productPhotoUrl?: string | null;
  listPrice: number;
  threshold?: number | null;
}
