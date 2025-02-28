import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface LocationDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface LocationCreateUpdateDto {
  name: string;
}

export interface LocationSearchDto extends PagedRequestAbstractDto {
  search: string;
}
