import styled from "@emotion/styled";
import { Box, Tab, TabProps, Tabs } from "@mui/material";

interface PbTabProps extends TabProps {
  haserror?: boolean;
}

export const PbTab = styled((props: PbTabProps) => {
  var hidden = false;

  return (
    <Tab
      disableRipple
      style={{
        color: (props.haserror && "red") || undefined,
        display: (hidden && "none") || undefined,
      }}
      {...{ ...props, haserror: undefined }}
    />
  );
})(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: "rgba(0, 0, 0, 0.85)",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    color: "#40a9ff",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#1890ff",
    fontWeight: theme.typography.fontWeightMedium,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

export function PbTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const PbTabs = styled((props: any) => (
  <Tabs
    variant={props.variant || "scrollable"}
    scrollButtons={props.scrollButtons || "auto"}
    {...props}
  ></Tabs>
))({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#1890ff",
  },
});
