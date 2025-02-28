import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface WarehouseDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface WarehouseCreateUpdateDto {
  name: string;
}

export interface WarehouseSearchDto extends PagedRequestAbstractDto {
  search: string;
}
