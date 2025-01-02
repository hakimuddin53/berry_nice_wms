import { guid } from "types/guid";

export interface ProductCreateUpdateDto {
  id: guid;
  name: string;
  itemCode: string;
  clientCode: string;
  warehouseCode: string;
  category: string;
  subCategory: string;
  size: string;
  colour: string;
  itemType: string;
  productPhotoUrl: string;
  locationId?: guid | null;
}
