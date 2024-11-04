import { Grid } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type ValueFilterProps = {
  includeTo?: boolean | false;
  onChange: (from: Date | null, to: Date | null) => void;
};

const ToLabel = styled(Grid)`
  font-weight: 700;

  ${(props) =>
    props.theme.breakpoints.up("xs") || props.theme.breakpoints.up("sm")} {
    text-align: left;
  }
  ${(props) =>
    props.theme.breakpoints.up("md") || props.theme.breakpoints.up("lg")} {
    text-align: right;
  }
`;

const DateFilter = (props: ValueFilterProps) => {
  const { includeTo, onChange } = props;
  const [fromDate, setFromDate] = useState<Date | null>();
  const [fromTime, setFromTime] = useState<Date | null>();
  const [toDate, setToDate] = useState<Date | null>();
  const [toTime, setToTime] = useState<Date | null>();

  const { t } = useTranslation();

  const handleFromDateChange = (value: Date | null) => {
    setFromDate(value);

    let combinedFromDateTime = combineDateWithTime(value, fromTime || null);
    let combinedToDateTime = combineDateWithTime(
      toDate || null,
      toTime || null
    );

    onChange(combinedFromDateTime, combinedToDateTime);
  };

  const handleFromTimeChange = (value: Date | null) => {
    setFromTime(value);

    let combinedFromDateTime = combineDateWithTime(fromDate || null, value);
    let combinedToDateTime = combineDateWithTime(
      toDate || null,
      toTime || null
    );

    onChange(combinedFromDateTime, combinedToDateTime);
  };

  const handleToDateChange = (value: Date | null) => {
    setToDate(value);

    let combinedToDateTime = combineDateWithTime(value, toTime || null);
    let combinedFromDateTime = combineDateWithTime(
      fromDate || null,
      fromTime || null
    );

    onChange(combinedFromDateTime, combinedToDateTime);
  };

  const handleToTimeChange = (value: Date | null) => {
    setToTime(value);

    let combinedToDateTime = combineDateWithTime(toDate || null, value);
    let combinedFromDateTime = combineDateWithTime(
      fromDate || null,
      fromTime || null
    );

    onChange(combinedFromDateTime, combinedToDateTime);
  };

  const combineDateWithTime = (d: Date | null, t: Date | null) => {
    if (d && t) {
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        t.getMilliseconds()
      );
    } else {
      return d || null;
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={2}>
        <DatePicker
          onChange={handleFromDateChange}
          slotProps={{ textField: { variant: "outlined", size: "small" } }}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TimePicker
          onChange={handleFromTimeChange}
          slotProps={{ textField: { variant: "outlined", size: "small" } }}
        />
      </Grid>
      {includeTo && (
        <>
          <Grid
            item
            xs={12}
            md={1}
            sx={{ alignContent: "center", textAlign: "center" }}
          >
            <ToLabel item xs={12} sm={4} md={11}>
              {t("common:to")}
            </ToLabel>
          </Grid>
          <Grid item xs={12} md={2}>
            <DatePicker
              onChange={handleToDateChange}
              slotProps={{ textField: { variant: "outlined", size: "small" } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TimePicker
              onChange={handleToTimeChange}
              slotProps={{ textField: { variant: "outlined", size: "small" } }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DateFilter;
