import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface CartonSizeDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface CartonSizeCreateUpdateDto {
  name: string;
}

export interface CartonSizeSearchDto extends PagedRequestAbstractDto {
  search: string;
}
