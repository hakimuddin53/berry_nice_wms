import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";
import { getInstanceByDom, init } from "echarts";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
  resizeNotifier?: any;
  setChartInstance?: (chartInstance: ECharts) => void;
}

export function ReactECharts({
  option,
  style,
  settings,
  loading,
  theme,
  resizeNotifier,
  setChartInstance,
}: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart) {
        chart.clear();
        chart.setOption({ ...option }, settings);
        window.setTimeout(
          () => chart.resize({ silent: true, animation: { duration: 1000 } }),
          10
        );
        if (setChartInstance) {
          setChartInstance(chart);
        }
      }
    }
  }, [option, settings, theme, setChartInstance]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (chart) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        loading === true ? chart.showLoading() : chart.hideLoading();
      }
    }
  }, [loading, theme]);

  useEffect(() => {
    if (resizeNotifier !== undefined) {
      if (chartRef.current !== null) {
        const chart = getInstanceByDom(chartRef.current);
        if (chart) {
          chart.resize();
        }
      }
    }
  }, [resizeNotifier]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />
  );
}
