import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { PagedRequestAbstractDto } from "interfaces/v12/pagedRequest/pagedRequestAbstractDto";
import { guid } from "../../../../types/guid";

export interface UserDetailsV12Dto extends CreatedChangedEntity {
  id: guid;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userRoleId: string;
  userRoleName: string;
}

export interface UserSearchDto extends PagedRequestAbstractDto {
  search: string;
}
