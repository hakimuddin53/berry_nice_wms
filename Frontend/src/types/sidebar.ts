import { ModuleEnum } from "interfaces/enums/GlobalEnums";

export type SidebarItemsType = {
  id: any;
  href: string;
  itemType: string;
  title: string;
  icon: any;
  children: SidebarItemsType[];
  badge?: string;
  type: string;
  requiredModule?: ModuleEnum; // <--- Add this optional property
};
