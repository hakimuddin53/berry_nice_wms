import { Download, Image, TableChart } from "@mui/icons-material";
import {
  Fab,
  FabProps,
  IconButton,
  IconButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { ECharts } from "echarts";
import { ChartType } from "interfaces/enums/DashboardEnums";
import { KeyedObject } from "interfaces/v12/dashboard/ChartResultV12Dto";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChartExportMenuButtonProps = (FabProps | IconButtonProps) & {
  data: KeyedObject[];
  name: string;
  chartType: ChartType;
  chartInstance?: ECharts;
  disabled?: boolean;
  buttonType?: "iconButton" | "fab";
  onClose?: () => void;
};
const ChartExportMenuButton = (props: ChartExportMenuButtonProps) => {
  const {
    data,
    name,
    chartType,
    chartInstance,
    disabled,
    buttonType,
    onClose,
    ...iconButtonProps
  } = props;
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const chartInstanceAvailable =
    chartInstance &&
    (chartType === ChartType.BAR_CHART ||
      chartType === ChartType.LINE_CHART ||
      chartType === ChartType.PIE_CHART);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    if (onClose) {
      onClose();
    }
  };

  const downloadFile = (data: string, fileName: string) => {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = data;
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const downloadCsv = () => {
    if (!data || data.length === 0) {
      return;
    }
    const headers = Object.keys(data[0]).join(";");
    const csvData = data.reduce((acc, d) => {
      acc.push(
        Object.values(d)
          .map((x) => (x ? x.toString() : ""))
          .join(";")
      );
      return acc;
    }, [] as string[]);
    const blob = new Blob([[headers, ...csvData].join("\n")], {
      type: "text/csv",
    });
    const fileName = name ? name : "data";
    downloadFile(window.URL.createObjectURL(blob), fileName + ".csv");
    closeMenu();
  };

  const downloadImage = (format: "png" | "jpeg") => {
    if (chartInstanceAvailable && chartInstance) {
      const data = chartInstance.getDataURL({
        type: format,
        backgroundColor: "white",
        excludeComponents: ["toolbox", "dataZoom"],
      });
      const fileName = name ? name : "data";
      downloadFile(data, fileName + "." + format);
      closeMenu();
    }
  };

  if (!data || data.length === 0) {
    return <></>;
  }

  return (
    <div>
      <Tooltip title={t("common:download")}>
        {props.buttonType === "fab" ? (
          <Fab
            size="small"
            {...iconButtonProps}
            onClick={openMenu}
            disabled={disabled}
          >
            <Download />
          </Fab>
        ) : (
          <IconButton
            size="small"
            {...iconButtonProps}
            onClick={openMenu}
            disabled={disabled}
          >
            <Download />
          </IconButton>
        )}
      </Tooltip>
      {!disabled && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={downloadCsv}>
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText>CSV</ListItemText>
          </MenuItem>
          {chartInstanceAvailable && (
            <MenuItem onClick={() => downloadImage("png")}>
              <ListItemIcon>
                <Image />
              </ListItemIcon>
              <ListItemText>PNG</ListItemText>
            </MenuItem>
          )}
          {chartInstanceAvailable && (
            <MenuItem onClick={() => downloadImage("jpeg")}>
              <ListItemIcon>
                <Image />
              </ListItemIcon>
              <ListItemText>JPEG</ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
};

export default ChartExportMenuButton;
