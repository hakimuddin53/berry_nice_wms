import { Typography } from "@mui/material";
import { getFontColor } from "components/platbricks/shared/ColorSelect";
import Icon from "components/platbricks/shared/Icon";
import { ReactECharts } from "components/platbricks/shared/ReactEchart";
import { ECharts, EChartsOption } from "echarts";
import { ChartType, getEChartType } from "interfaces/enums/DashboardEnums";
import {
  ChartResultV12Dto,
  KeyedObject,
} from "interfaces/v12/dashboard/ChartResultV12Dto";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChartExportMenuButton from "./ChartExportMenuButton";
import Metric from "./Metric";
import TableChart from "./TableChart";

const isChart = (chartType: ChartType) =>
  chartType === ChartType.BAR_CHART ||
  chartType === ChartType.LINE_CHART ||
  chartType === ChartType.PIE_CHART;

const getValues = (list: KeyedObject[], identifier: string) => {
  var values: any[] = [];
  var allNumber = true;
  for (let value of list) {
    if (
      (value[identifier] || value[identifier] === 0) &&
      !values.includes(value[identifier])
    ) {
      values.push(value[identifier]);
      if (allNumber && isNaN(Number(value[identifier]))) {
        allNumber = false;
      }
    }
  }
  //Sort x values if all are number
  if (allNumber) {
    values.sort((a, b) => Number(a) - Number(b));
  }
  return values;
};

const getLabelRotation = (chartType: ChartType, xValues: any[]) => {
  if (chartType === ChartType.BAR_CHART) {
    const maxXLabelLength = Math.max(...xValues.map((x) => x.length));
    if (maxXLabelLength > 8) {
      if (xValues.length * maxXLabelLength > 200) return 45;
      if (xValues.length * maxXLabelLength > 100) return 30;
    }
    return 0;
  }
  return 0;
};

interface ChartProps {
  chartInfo: ChartResultV12Dto;
  resizeNotifier?: any;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  enableDownload?: boolean;
  setChartInstance?: (value?: ECharts) => void;
}
const DashboardChart = (props: ChartProps) => {
  const { t } = useTranslation("dashboard");
  const [chartOptions, setChartOptions] = useState<EChartsOption | null>(null);
  const [chartInstance, _setChartInstance] = useState<ECharts>();

  const { setChartInstance: propSetChartInstance } = props;

  const setChartInstance = useCallback(
    (value: ECharts) => {
      _setChartInstance(value);
      if (propSetChartInstance) {
        propSetChartInstance(value);
      }
    },
    [propSetChartInstance]
  );

  const renderChart = useCallback(() => {
    if (
      props.chartInfo.chartType === ChartType.TABLE ||
      props.chartInfo.chartType === ChartType.METRIC_CHART
    ) {
      setChartOptions(null);
      return;
    }
    const data = props.chartInfo.data;
    const metadata = props.chartInfo;

    const xName = metadata.keyX;
    const hueName = metadata.keyHue;
    const yName = metadata.keyY;

    var xValues = getValues(data, xName);
    var hueValues: any[] = [null];
    if (hueName && hueName !== "None") {
      hueValues = getValues(data, hueName);
    }

    const labelRotation = getLabelRotation(props.chartInfo.chartType, xValues);
    const showDataZoom = props.chartInfo.chartType === ChartType.LINE_CHART;

    var newChartOptions: EChartsOption = {
      tooltip: {
        trigger:
          props.chartInfo.chartType === ChartType.PIE_CHART ? "item" : "axis",
        axisPointer: {
          type:
            props.chartInfo.chartType === ChartType.BAR_CHART
              ? "shadow"
              : "line",
        },
        appendToBody: true,
        valueFormatter: (value) => (value ? value.toLocaleString() : ""),
      },
      grid: {
        containLabel: true,
        bottom: labelRotation === 0 ? (showDataZoom ? 65 : 25) : 5,
        right: labelRotation === 0 ? "5%" : "10%",
        left: labelRotation === 0 ? "5%" : "10%",
      },
    };
    newChartOptions.series = [];

    for (let hue of hueValues) {
      if (
        props.chartInfo.chartType === ChartType.PIE_CHART &&
        newChartOptions.series.length > 0
      ) {
        //For Pie Charts only one dataset is possible
        continue;
      }
      var newData = [];
      for (let x of xValues) {
        if (yName && yName !== "None") {
          var match: KeyedObject | undefined = undefined;
          if (hue !== null) {
            match = data.find((d) => d[hueName] === hue && d[xName] === x);
          } else {
            match = data.find((d) => d[xName] === x);
          }
          newData.push({
            value: match ? Number(match[yName]) : 0,
            name: x.toString(),
          });
        } else {
          newData.push({
            value: x,
            name: xName,
          });
        }
      }
      newChartOptions.series.push({
        name: hue !== null ? hue : "",
        data: newData,
        type: getEChartType(props.chartInfo.chartType),
        radius: "50%",
        stack:
          props.chartInfo.chartType === ChartType.BAR_CHART
            ? "total"
            : undefined, //this will make a stacked bar chart
      });
    }

    if (
      props.chartInfo.chartType === ChartType.BAR_CHART ||
      props.chartInfo.chartType === ChartType.LINE_CHART
    ) {
      newChartOptions.xAxis = {
        type: "category",
        name: xName,
        nameLocation: labelRotation === 0 ? "middle" : "end",
        nameGap: 25,
        data: xValues.map((x) => x.toString()),
        axisLabel: {
          rotate: labelRotation,
        },
      };
      newChartOptions.yAxis = {
        type: "value",
        name: yName,
      };
      if (showDataZoom) {
        newChartOptions.dataZoom = [
          {
            show: true,
            realtime: true,
          },
          {
            type: "inside",
            realtime: true,
          },
        ];
      }
    }
    setChartOptions(newChartOptions);
  }, [props.chartInfo]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  var dataAvailable = props.chartInfo && props.chartInfo.data.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          marginBottom:
            isChart(props.chartInfo.chartType) && dataAvailable ? 0 : 10,
          display: "flex",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {props.icon && (
          <Icon
            icon={props.icon}
            style={{
              backgroundColor: props.iconBackgroundColor ?? undefined,
              color: props.iconBackgroundColor
                ? getFontColor(props.iconBackgroundColor)
                : undefined,
              padding: props.iconBackgroundColor ? "2px" : undefined,
              fontSize: "34px",
              alignSelf: "flex-start",
              borderRadius: "5px",
            }}
          />
        )}
        <Typography variant="h6" flexGrow={1}>
          {props.chartInfo.chartTitle}
          {(isChart(props.chartInfo.chartType) ||
            props.chartInfo.chartType === ChartType.METRIC_CHART) &&
          props.chartInfo.unit
            ? " [" + props.chartInfo.unit + "]"
            : ""}
        </Typography>
        {props.enableDownload && (
          <ChartExportMenuButton
            data={props.chartInfo.data}
            name={props.chartInfo.chartTitle}
            chartType={props.chartInfo.chartType}
            chartInstance={chartInstance}
            sx={{ alignSelf: "flex-start" }}
          />
        )}
      </div>
      {props.chartInfo.chartType === ChartType.TABLE ? (
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "strech",
          }}
        >
          <TableChart data={props.chartInfo.data} />
        </div>
      ) : (
        <div
          style={{
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          {props.chartInfo.chartType === ChartType.METRIC_CHART ? (
            <Metric
              data={props.chartInfo.data}
              yKey={props.chartInfo.keyY}
              xKey={props.chartInfo.keyX}
            />
          ) : chartOptions && dataAvailable ? (
            <ReactECharts
              option={chartOptions}
              resizeNotifier={props.resizeNotifier}
              setChartInstance={setChartInstance}
            />
          ) : !dataAvailable ? (
            <>{t("no-data-to-display")}</>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardChart;
