import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface DesignDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface DesignCreateUpdateDto {
  name: string;
}

export interface DesignSearchDto extends PagedRequestAbstractDto {
  search: string;
}
