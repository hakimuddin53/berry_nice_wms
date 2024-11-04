import {
  ChartType,
  DashboardScreenSizeEnum,
} from "interfaces/enums/DashboardEnums";
import { guid } from "types/guid";

export interface DashboardUpdateV12Dto {
  id: guid;
  name: string;
  isHomepage: boolean;
  dashboardItems: _DashboardItemUpdateV12Dto[];
}

export interface _DashboardItemUpdateV12Dto {
  id: guid;
  dashboardId: guid;
  chartType: ChartType;
  title: string;
  keyX: string;
  keyY: string;
  keyHue: string;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  dashboardCatalogItemId: guid;
  dashboardItemScreenPositions: _DashboardItemScreenPositionUpdateV12Dto[];
  locationId?: guid;
}

export interface _DashboardItemScreenPositionUpdateV12Dto {
  id: guid;
  dashboardItemId: guid;
  screenSize: DashboardScreenSizeEnum;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}
