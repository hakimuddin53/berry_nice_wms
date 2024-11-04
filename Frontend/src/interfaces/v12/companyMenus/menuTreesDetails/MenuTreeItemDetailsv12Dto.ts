import { guid } from "types/guid";

export interface MenuTreeItemDetailsv12Dto {
  id: guid;
  name: string;
  url: string;
  itemType: MenuItemTypeEnum;
  icon?: string;
  locationId?: guid;
  children: MenuTreeItemDetailsv12Dto[];
  // catalogId: guid;
  menuTreeDisplayType: MenuTreeDisplayType;
}

export enum MenuTreeDisplayType {
  Folder,
  Page,
  Separator,
}

export enum MenuItemTypeEnum {
  MVC = "MVC",
  REACT = "REACT",
  EXTERNAL_LINK = "EXTERNAL_LINK",
}
