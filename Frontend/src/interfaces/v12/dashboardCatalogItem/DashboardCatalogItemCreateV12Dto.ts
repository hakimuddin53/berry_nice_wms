import {
  ChartType,
  DashboardCatalogItemTypeEnum,
  MaintainedSqlEnum,
} from "interfaces/enums/DashboardEnums";

export interface DashboardCatalogItemCreateV12Dto {
  type: DashboardCatalogItemTypeEnum;
  maintainedSqlQuery: MaintainedSqlEnum;
  sqlQuery: string;
  chartType: ChartType;
  chartTitle: string;
  keyX: string;
  keyY: string;
  keyHue: string;
}
