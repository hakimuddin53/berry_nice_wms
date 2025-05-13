import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface InventoryDetailsDto extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  warehouseId: guid;
  currentLocationId: guid;
  quantityIn: number;
  quantityOut: number;
  oldBalance: number;
  newBalance: number;
  product: string;
  warehouse: string;
  currentLocation: string;
  transactionNumber: string;
  clientCode: string;
  stockGroup: string;
}

export interface InventorySummaryDetailsDto extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  warehouseId: guid;
  currentLocationId: guid;
  availableQuantity: number;
  product: string;
  warehouse: string;
  currentLocation: string;
  clientCode: string;
  stockGroup: string;
}

export interface InventorySearchDto extends PagedRequestAbstractDto {
  productId?: string[];
  warehouseId?: string[];
  clientCodeId?: string[];
  locationId?: string[];
}
