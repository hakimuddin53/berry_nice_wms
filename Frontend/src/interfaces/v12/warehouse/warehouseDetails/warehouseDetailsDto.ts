import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface WarehouseDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}
