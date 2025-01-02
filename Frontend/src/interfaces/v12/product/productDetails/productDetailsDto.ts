import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface ProductDetailsDto extends CreatedChangedEntity {
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
  productUoms: ProductUom[];
}

export interface ProductUom extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  uomId: guid;
}
