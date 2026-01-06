import { ModuleEnum } from "interfaces/enums/GlobalEnums";
import { guid } from "types/guid";
import { CreatedChangedEntity } from "../CreatedChangedEntity";
import { PagedRequestAbstractDto } from "../pagedRequest/pagedRequestAbstractDto";

export interface UserRoleDetailsDto extends CreatedChangedEntity {
  id: guid;
  name: string;
  displayName: string;
  module: ModuleEnum[];
}

export interface UserRoleSearchDto extends PagedRequestAbstractDto {
  search: string;
}
