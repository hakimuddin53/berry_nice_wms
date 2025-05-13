import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface ProductDetailsDto extends CreatedChangedEntity {
  id: guid;
  serialNumber: string;
  name: string;
  itemCode: string;
  clientCodeId: guid;
  clientCodeString: string;
  quantityPerCarton: number;
  category: string;
  size: string;
  colour: string;
  design: string;
  cartonSize: string;

  categoryId: guid;
  sizeId: guid;
  colourId: guid;
  designId: guid;
  cartonSizeId: guid;

  productPhotoUrl: string | null;
  listPrice: number;
  threshold: number;
}
