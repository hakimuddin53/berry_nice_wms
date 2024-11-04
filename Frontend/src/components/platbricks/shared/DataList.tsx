import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";

export interface DataListDataProps {
  label: string;
  value: string | JSX.Element;
  required?: boolean;
}

export interface DataListProps {
  data: DataListDataProps[];
  spacing?: number;
  xs?: number;
  md?: number;
  mdLabel?: number;
  hideDevider?: boolean;
}

const DataListRow = styled.div<{ hideDevider: boolean }>`
  border-bottom: ${(props) => (props.hideDevider ? 0 : "1px solid lightgray")};
  padding-bottom: 10px;
  padding-top: 10px;
`;

const DataListLabel = styled(Grid)`
  font-weight: 700;

  ${(props) => props.theme.breakpoints.up("xs")} {
    text-align: left;
  }
  ${(props) => props.theme.breakpoints.up("sm")} {
    text-align: right;
  }
  padding-top: 9px !important;
`;

const DataListValue = styled(Grid)`
  padding-top: 0 !important;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding-right: 10px;
`;

const DataList = (props: DataListProps) => {
  return (
    <Grid container spacing={1}>
      {props.data
        .filter((x) => x.label)
        .map((item, index) => {
          return (
            <Grid item xs={props.xs || 12} md={props.md || 6} key={index}>
              <DataListRow hideDevider={!!props.hideDevider}>
                <Grid container spacing={3} wrap="nowrap">
                  <DataListLabel
                    item
                    xs={12}
                    sm={4}
                    md={props.mdLabel ? props.mdLabel : 4}
                  >
                    <span style={{ overflowWrap: "break-word" }}>
                      {item.label}
                    </span>
                    {item.required && <span style={{ color: "red" }}>*</span>}
                  </DataListLabel>
                  <DataListValue
                    item
                    xs={12}
                    sm={8}
                    md={props.mdLabel ? 12 - props.mdLabel : 8}
                  >
                    {item.value}
                  </DataListValue>
                </Grid>
              </DataListRow>
            </Grid>
          );
        })}
    </Grid>
  );
};
export default DataList;
