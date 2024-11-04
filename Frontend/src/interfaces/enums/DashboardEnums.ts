export const ChartType = {
  TABLE: "TABLE",
  BAR_CHART: "BAR_CHART",
  LINE_CHART: "LINE_CHART",
  PIE_CHART: "PIE_CHART",
  METRIC_CHART: "METRIC_CHART",
} as const;

export const DashboardCatalogItemTypeEnum = {
  MAINTAINED: "MAINTAINED",
  CUSTOM: "CUSTOM",
} as const;

export const MaintainedSqlEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  GET_CONFRIMED_ORDER_COUNT_BY_QUEUE_DEVICE:
    "GET_CONFRIMED_ORDER_COUNT_BY_QUEUE_DEVICE",
  GET_ORDER_STATUS_COUNT_BY_QUEUE: "GET_ORDER_STATUS_COUNT_BY_QUEUE",
  GET_ORDERS_FINISHED: "GET_ORDERS_FINISHED",
  GET_ORDER_TASKS_FINISHED: "GET_ORDER_TASKS_FINISHED",
} as const;

export const DashboardScreenSizeEnum = {
  XS: "XS",
  SM: "SM",
  MD: "MD",
  LG: "LG",
  XL: "XL",
} as const;

export const getChartType: (type: string) => ChartType = (type: string) => {
  switch (type) {
    case "bar chart":
      return ChartType.BAR_CHART;
    case "pie chart":
      return ChartType.PIE_CHART;
    case "line chart":
      return ChartType.LINE_CHART;
    case "metric chart":
      return ChartType.METRIC_CHART;
    default:
      return ChartType.TABLE;
  }
};

export const getChartTypeString: (type: ChartType) => string = (
  type: ChartType
) => {
  switch (type) {
    case ChartType.BAR_CHART:
      return "bar chart";
    case ChartType.PIE_CHART:
      return "pie chart";
    case ChartType.LINE_CHART:
      return "line chart";
    case ChartType.METRIC_CHART:
      return "metric chart";
    default:
      return "default";
  }
};

export const getEChartType: (type: ChartType) => "bar" | "pie" | "line" = (
  type: ChartType
) => {
  switch (type) {
    case ChartType.BAR_CHART:
      return "bar";
    case ChartType.PIE_CHART:
      return "pie";
    case ChartType.LINE_CHART:
      return "line";
    default:
      return "bar";
  }
};

export const getChartTypeIconName = (type: ChartType) => {
  switch (type) {
    case ChartType.BAR_CHART:
      return "BarChart";
    case ChartType.PIE_CHART:
      return "PieChart";
    case ChartType.LINE_CHART:
      return "Timeline";
    case ChartType.METRIC_CHART:
      return "Speed";
    default:
      return "TableChart";
  }
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type ChartType = typeof ChartType[keyof typeof ChartType];
export type DashboardCatalogItemTypeEnum =
  typeof DashboardCatalogItemTypeEnum[keyof typeof DashboardCatalogItemTypeEnum];
export type MaintainedSqlEnum =
  typeof MaintainedSqlEnum[keyof typeof MaintainedSqlEnum];
export type DashboardScreenSizeEnum =
  typeof DashboardScreenSizeEnum[keyof typeof DashboardScreenSizeEnum];
/* eslint-enable */
