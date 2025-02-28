import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface CategoryDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface CategoryCreateUpdateDto {
  name: string;
}

export interface CategorySearchDto extends PagedRequestAbstractDto {
  search: string;
}
