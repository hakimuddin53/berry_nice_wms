import {
  ChartType,
  DashboardScreenSizeEnum,
} from "interfaces/enums/DashboardEnums";
import { DashboardCatalogItemDetailsV12Dto } from "interfaces/v12/dashboardCatalogItem/DashboardCatalogItemDetailsV12Dto";
import { guid } from "types/guid";

export interface DashboardDetailsV12Dto {
  id: guid;
  name: string;
  isHomepage: boolean;
  createdById: guid;
  createdAt: string;
  changedById?: guid;
  changedAt?: string;
  dashboardItems: _DashboardItemDetailsV12Dto[];
}

export interface _DashboardItemDetailsV12Dto {
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
  dashboardCatalogItem: DashboardCatalogItemDetailsV12Dto;
  dashboardItemScreenPositions: _DashboardItemScreenPositionDetailsV12Dto[];
  locationId?: guid;
  createdById: guid;
  createdAt: string;
  changedById?: guid;
  changedAt?: string;
}

export interface _DashboardItemScreenPositionDetailsV12Dto {
  id: guid;
  dashboardItemId: guid;
  screenSize: DashboardScreenSizeEnum;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdById: guid;
  createdAt: string;
  changedById?: guid;
  changedAt?: string;
}
