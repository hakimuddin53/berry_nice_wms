import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface ClientCodeDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
}

export interface ClientCodeCreateUpdateDto {
  name: string;
}

export interface ClientCodeSearchDto extends PagedRequestAbstractDto {
  search: string;
}
