import * as icons from "@mui/icons-material";
import { CompanyMenuDetailsV12Dto } from "interfaces/v12/companyMenus/menuTreesDetails/CompanyMenuDetailV12Dto";
import {
  MenuItemTypeEnum,
  MenuTreeItemDetailsv12Dto,
} from "interfaces/v12/companyMenus/menuTreesDetails/MenuTreeItemDetailsv12Dto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCompanyMenuService } from "services/CompanyMenuService";
import { guid } from "types/guid";
import { SidebarItemsType } from "types/sidebar";

//Private function
const mapReactIcon = (icon: string | undefined) => {
  // let iconName = icon ? icon : "panorama_fish_eye";
  // return <Icon sx={{ color: blueGrey[400] }}>{iconName}</Icon>;
  const defaultIcon = "PanoramaFishEye";
  if (!icon) {
    return defaultIcon;
  } else {
    let iconName = convertToReactIconName(icon);
    if (isValidIconProp(iconName)) {
      return iconName;
    } else {
      return defaultIcon;
    }
  }
};

const isValidIconProp = (icon: string | undefined) => {
  if (!icon) {
    return false;
  }
  const allIconNames = Object.keys(icons);
  let isValid = allIconNames.includes(icon);
  return isValid;
};

const convertToReactIconName = (input: string) => {
  var result = input.charAt(0).toUpperCase() + input.slice(1);
  return result;
};

//Map Location
const getSection = (element: MenuTreeItemDetailsv12Dto) => {
  const sideItemsType = {
    id: element.id,
    href: element.url?.replaceAll(":locationId", element.locationId || ""),
    itemType: element.itemType.toString(),
    title: element.name,
    icon:
      element.itemType === MenuItemTypeEnum.REACT
        ? mapReactIcon(element.icon)
        : "",
    children: getChildrenSections(element.children, element.locationId),
    type: element.menuTreeDisplayType.toString(),
  } as SidebarItemsType;

  return sideItemsType;
};

const getChildrenSections = (
  children: MenuTreeItemDetailsv12Dto[],
  parentLocationId?: string
) => {
  const sideItemsTypes = [] as SidebarItemsType[];

  if (children) {
    children.forEach((element) => {
      const obj = {
        id: element.id,
        href: element.url?.replaceAll(
          ":locationId",
          element.locationId || parentLocationId || ""
        ),
        itemType: element.itemType.toString(),
        title: element.name,
        icon:
          element.itemType === MenuItemTypeEnum.REACT
            ? mapReactIcon(element.icon)
            : "",
        children: getChildrenSections(
          element.children,
          element.locationId || parentLocationId
        ),
      } as SidebarItemsType;

      sideItemsTypes.push(obj);
    });
  }
  return sideItemsTypes;
};

const useCompanyMenu = (companyMenuId: guid) => {
  const { t } = useTranslation("menu");
  const [companyMenu, setCompanyMenu] =
    useState<CompanyMenuDetailsV12Dto | null>(null);

  let dashboardItems: SidebarItemsType[] = [];

  const CompanyMenuService = useCompanyMenuService();

  //Side Effect
  useEffect(() => {
    const fetchData = async () => {
      CompanyMenuService.getCompanyMenusById(companyMenuId).then(
        (companyMenu) => {
          if (companyMenu) {
            setCompanyMenu(companyMenu);
          }
        }
      );
    };

    fetchData();
  }, [CompanyMenuService, companyMenuId]);
  //}, []);
  if (companyMenu) {
    companyMenu.menuTrees.forEach((element) => {
      const sideItemsType = getSection(element);
      dashboardItems.push(sideItemsType);
    });
  }
  dashboardItems = removeEmptyPages(dashboardItems);

  const translateArray = (arr: SidebarItemsType[]) => {
    arr.forEach((element) => {
      element.title = t(element.title);
      translateArray(element.children);
    });
  };
  translateArray(dashboardItems);

  return dashboardItems;
};

const removeEmptyPages = (pages: SidebarItemsType[]): SidebarItemsType[] => {
  pages.forEach((page) => {
    page.children = removeEmptyPages(page.children);
  });
  return pages.filter((page) => {
    if (page.type === "Separator") {
      return true;
    }

    if (!page.href) {
      return false;
    }
    if (page.href === "#" && page.children.length === 0) {
      return false;
    }
    if (
      page.href !== "#" &&
      page.itemType !== MenuItemTypeEnum[MenuItemTypeEnum.REACT]
    ) {
      return false;
    }

    return true;
  });
};

export default useCompanyMenu;
