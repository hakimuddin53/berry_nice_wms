import { MenuItemTypeEnum } from "interfaces/enums/GlobalEnums";
import { guid } from "types/guid";

export interface CatalogMenuItemDetailsV12Dto {
  id: guid;
  name: string;
  icon: string;
  url: string;
  weight: number;
  isGlobalItem: boolean;
  type: MenuItemTypeEnum;
  catalogMenuItemReferences: CatalogMenuItemCompanyAssignmentDetailsV12Dto[];
}

export interface CatalogMenuItemCompanyAssignmentDetailsV12Dto {
  id: guid;
  companyId: guid;
  catalogMenuItemId: guid;
  catalogMenuItem: CatalogMenuItemDetailsV12Dto;
}
