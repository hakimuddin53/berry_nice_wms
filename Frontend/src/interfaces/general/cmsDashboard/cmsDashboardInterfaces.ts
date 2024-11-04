import { SidebarItemsType } from "types/sidebar";

export interface DasboardItemProp {
  item: SidebarItemsType;
  showWithoutChildren: boolean;
  searchText: string;
  filterTitleWithSearchText: boolean;
}
