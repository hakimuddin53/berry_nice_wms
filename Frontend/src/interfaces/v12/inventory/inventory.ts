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
  orderNumber: string;
  clientCode: string;
  stockGroup: string;
  size: string;
}

export interface InventorySummaryDetailsDto extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  warehouseId: guid;
  currentLocationId: guid;
  availableQuantity: number;
  productName: string;
  productCode: string;
  warehouse: string;
  currentLocation: string;
  clientCode: string;
  stockGroup: string;
  size: string;
}

export interface InventorySummaryByProductDetailsDto
  extends CreatedChangedEntity {
  id: guid;
  productId: guid;
  warehouseId: guid;
  availableQuantity: number;
  availableAfterReserved: number;
  reservedQuantity: number;
  product: string;
  warehouse: string;
  clientCode: string;
  stockGroup: string;
  size: string;
}

export interface InventorySearchDto extends PagedRequestAbstractDto {
  productId?: string[];
  warehouseId?: string[];
  clientCodeId?: string[];
  locationId?: string[];
}
