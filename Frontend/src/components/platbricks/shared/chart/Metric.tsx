import { Box, Typography } from "@mui/material";
import { KeyedObject } from "interfaces/v12/dashboard/ChartResultV12Dto";
import { useTranslation } from "react-i18next";
import { arvatoBlue } from "theme/variants";

interface MetricProps {
  data?: KeyedObject[];
  yKey?: string;
  xKey?: string;
}
const Metric = (props: MetricProps) => {
  const { t } = useTranslation("dashboard");

  var value: any = null;

  if (props.data && props.data.length === 1) {
    var xName = props.xKey;
    var yName = props.yKey;
    var data = props.data[0];

    if (xName && xName !== "None" && (!yName || yName === "None")) {
      if (typeof xName != "string") xName = xName[0];
      value = data[xName];
    } else if (yName && yName !== "None" && (!xName || xName === "None")) {
      value = data[yName];
    }
  }

  if (!props.data || props.data.length === 0) {
    return <>{t("no-data-to-display")}</>;
  }

  if (value === null) {
    return (
      <Typography variant="body1" textAlign="center" paddingY={8}>
        {t("metric-not-supported")}
      </Typography>
    );
  }

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Typography variant="h1" color={arvatoBlue[500]} textAlign="center">
        {value}
      </Typography>
    </Box>
  );
};

export default Metric;
