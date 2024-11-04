import { guid } from "types/guid";
import { MenuTreeItemDetailsv12Dto } from "./MenuTreeItemDetailsv12Dto";

export interface CompanyMenuDetailsV12Dto {
  companyMenuId: guid;
  name: string;
  menuTrees: MenuTreeItemDetailsv12Dto[];
  createdById: guid;
  createdAt: string;
  changedById: guid;
  changedAt: string;
}

export enum MenuTreeDisplayType {
  Folder,
  Page,
  Separator,
}
