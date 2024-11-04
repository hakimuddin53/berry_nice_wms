import { ChartType } from "interfaces/enums/DashboardEnums";

export interface KeyedObject {
  [key: string]: null | string | number;
}

export interface ChartResultV12Dto {
  data: KeyedObject[];
  sqlQuery: string;
  chartType: ChartType;
  chartTitle: string;
  unit: string;
  keyX: string;
  keyY: string;
  keyHue: string;
}
