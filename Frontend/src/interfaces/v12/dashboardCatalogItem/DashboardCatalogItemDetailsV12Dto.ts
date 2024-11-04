import {
  ChartType,
  DashboardCatalogItemTypeEnum,
  MaintainedSqlEnum,
} from "interfaces/enums/DashboardEnums";
import { guid } from "types/guid";

export interface DashboardCatalogItemDetailsV12Dto {
  id: guid;
  type: DashboardCatalogItemTypeEnum;
  maintainedSqlQuery: MaintainedSqlEnum;
  sqlQuery: string;
  chartType: ChartType;
  chartTitle: string;
  keyX: string;
  keyY: string;
  keyHue: string;
  rowVersion: string;
  createdAt: string;
  createdById: guid;
  changedAt: string;
  changedById: guid;
}
