import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface ColourDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface ColourCreateUpdateDto {
  name: string;
}

export interface ColourSearchDto extends PagedRequestAbstractDto {
  search: string;
}
