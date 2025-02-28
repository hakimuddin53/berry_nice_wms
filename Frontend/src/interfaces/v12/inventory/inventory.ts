import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface InventoryDetailsDto extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  productCartonSizeId: guid;
  warehouseId: guid;
  currentLocationId: guid;
  quantityIn: number;
  quantityOut: number;
  oldBalance: number;
  newBalance: number;
}

export interface InventorySearchDto extends PagedRequestAbstractDto {
  search: string;
}
