import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Divider as MuiDivider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { spacing } from "@mui/system";
import React, { Fragment } from "react";

const Accordion = styled(MuiAccordion)`
  border-radius: 6px;
  text-align: left;
  margin: 0 0 !important;
  box-shadow: 0 2px 6px 0 rgba(18, 38, 63, 0.05);
  &:before {
    display: none;
  }
`;

const AccordionSummary = styled(MuiAccordionSummary)`
  padding: 0 8px;
  box-shadow: 0;
  min-height: 8px !important;
  background: transparent;
  .MuiAccordionSummary-content {
    margin: 4px 0 !important;
  }
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  padding-left: 8px;
  padding-right: 8px;
  overflow-y: auto;
  display: flex;
`;

const Divider = styled(MuiDivider)(spacing);

const SimpleAccordion: React.FC<{
  title: React.ReactNode;
  handleChange?: (expanded: boolean) => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <Fragment>
      <Accordion
        onChange={(e, expanded) => {
          props.handleChange && props.handleChange(expanded);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {props.title}
        </AccordionSummary>
        <Divider />
        <AccordionDetails>{props.children}</AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

export default SimpleAccordion;
