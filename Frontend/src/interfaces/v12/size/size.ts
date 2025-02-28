import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface SizeDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface SizeCreateUpdateDto {
  name: string;
}

export interface SizeSearchDto extends PagedRequestAbstractDto {
  search: string;
}
