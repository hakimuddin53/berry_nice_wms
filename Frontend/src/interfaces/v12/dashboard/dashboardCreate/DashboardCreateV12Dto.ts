import {
  ChartType,
  DashboardScreenSizeEnum,
} from "interfaces/enums/DashboardEnums";
import { guid } from "types/guid";

export interface DashboardCreateV12Dto {
  name: string;
  dashboardItems: _DashboardItemCreateV12Dto[];
}

export interface _DashboardItemCreateV12Dto {
  chartType: ChartType;
  title: string;
  keyX: string;
  keyY: string;
  keyHue: string;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  dashboardCatalogItemId: guid;
  dashboardItemScreenPositions: _DashboardItemScreenPositionCreateV12Dto[];
  locationId?: guid;
}

export interface _DashboardItemScreenPositionCreateV12Dto {
  screenSize: DashboardScreenSizeEnum;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}
