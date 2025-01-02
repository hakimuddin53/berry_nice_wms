import styled from "@emotion/styled";
import {
  Breakpoint,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PbBaseTheme } from "interfaces/general/theme/pbBaseTheme";
import React, { Fragment } from "react";

export interface KeyValueListProps {
  children: React.ReactNode;
  showDivider?: boolean;
  wrapBreakpoint?: number | Breakpoint;
  secondColumnBreakpoint?: number | Breakpoint;
  paddingBetween?: number;
  textAlignValue?: textAlign;
  textAlignLabel?: textAlign;
  verticalAlign?: alignSelf;
  marginTop?: string;
  gridTemplateColumns?: string; //for example: "2fr 3fr"
}
const KeyValueList = (props: KeyValueListProps) => {
  const theme = useTheme<PbBaseTheme>();
  props = { ...theme?.components?.KeyValueList?.defaultProps, ...props };
  const isWrapBreakpointUp = useMediaQuery(
    theme.breakpoints.up(
      props.wrapBreakpoint !== null && props.wrapBreakpoint !== undefined
        ? props.wrapBreakpoint
        : "lg"
    )
  );
  const showSecondColumn = useMediaQuery(
    theme.breakpoints.up(
      props.secondColumnBreakpoint !== null &&
        props.secondColumnBreakpoint !== undefined
        ? props.secondColumnBreakpoint
        : 9999
    )
  );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: showSecondColumn
          ? props.gridTemplateColumns
            ? props.gridTemplateColumns + " " + props.gridTemplateColumns
            : "auto 1fr auto 1fr" //alternative for WMS: "2fr 3fr 2fr 3fr"
          : isWrapBreakpointUp
          ? props.gridTemplateColumns
            ? props.gridTemplateColumns
            : "auto 1fr" //alternative for WMS: "2fr 3fr"
          : "auto",
        width: "100%",
        marginTop: props.marginTop ?? "10px",
        columnGap: "10px",
      }}
    >
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child) && child.type === KeyValuePair) {
          // Modifying here
          let newProps: KeyValuePairProps = { ...child.props };
          if (
            newProps.textAlignValue === undefined &&
            props.textAlignValue !== undefined
          ) {
            newProps.textAlignValue = props.textAlignValue;
          }
          if (
            newProps.textAlignLabel === undefined &&
            props.textAlignLabel !== undefined
          ) {
            newProps.textAlignLabel = props.textAlignLabel;
          }
          if (
            newProps.verticalAlign === undefined &&
            props.verticalAlign !== undefined
          ) {
            newProps.verticalAlign = props.verticalAlign;
          }
          if (!isWrapBreakpointUp && !showSecondColumn) {
            newProps.textAlignLabel = "left";
            newProps.textAlignValue = "left";
          }
          return (
            <React.Fragment>
              {index > 0 && (!showSecondColumn || index % 2 === 0) && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    padding:
                      props.paddingBetween !== undefined
                        ? props.paddingBetween / 2 + "px 0"
                        : "4px 0",
                  }}
                >
                  {props.showDivider && <Divider light></Divider>}
                </div>
              )}
              <KeyValuePair {...newProps}>{child.props.children}</KeyValuePair>
            </React.Fragment>
          );
        }
      })}
    </div>
  );
};

export type textAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "match-parent";
export type alignSelf =
  | "auto"
  | "baseline"
  | "center"
  | "end"
  | "normal"
  | "start"
  | "stretch";
interface GridItemProps {
  textAlign?: textAlign;
  verticalAlign?: alignSelf;
}
const GridItem = styled.div<GridItemProps>`
  align-self: ${(props) =>
    props.verticalAlign !== undefined ? props.verticalAlign : "start"};
  text-align: ${(props) =>
    props.textAlign !== undefined ? props.textAlign : "left"};
`;

export interface KeyValuePairProps {
  children: React.ReactNode;
  label: string;
  textAlignValue?: textAlign;
  textAlignLabel?: textAlign;
  verticalAlign?: alignSelf;
}
const KeyValuePair = (props: KeyValuePairProps) => {
  return (
    <Fragment>
      <GridItem
        textAlign={props.textAlignLabel ?? "right"}
        verticalAlign={props.verticalAlign}
      >
        <Typography fontWeight={"bold"}>{props.label}</Typography>
      </GridItem>
      <GridItem
        textAlign={props.textAlignValue}
        verticalAlign={props.verticalAlign}
      >
        {props.children}
      </GridItem>
    </Fragment>
  );
};

export { KeyValueList, KeyValuePair };
