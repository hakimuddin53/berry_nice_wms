import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Grid, List } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import ReactPerfectScrollbar from "react-perfect-scrollbar";

import { SidebarItemsType } from "../../types/sidebar";
import SidebarNavSection from "./SidebarNavSection";

import { useFilteredSidebarItems } from "hooks/useFilteredSidebarItems";
import { useTranslation } from "react-i18next";
import "../../vendor/perfect-scrollbar.css";

const baseScrollbar = (props: any) => css`
  background-color: ${props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Scrollbar = styled.div`
  ${baseScrollbar}
`;

const PerfectScrollbar = styled(ReactPerfectScrollbar)`
  ${baseScrollbar}
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

type SidebarNavProps = {
  items: SidebarItemsType[];
};

const SidebarNav: React.FC<SidebarNavProps> = ({ items }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const ScrollbarComponent = (
    matches ? PerfectScrollbar : Scrollbar
  ) as React.ElementType;
  const [minimize, setMinimize] = useState(0);
  const minimizeMenuItems = () => {
    setMinimize(minimize + 1);
  };

  const filteredDashboardItems = useFilteredSidebarItems(items);

  return (
    <ScrollbarComponent>
      <List disablePadding>
        <Items>
          <Grid container alignItems="center">
            <Grid item xs={10} />
          </Grid>
          <SidebarNavSection
            component="div"
            pages={filteredDashboardItems}
            minimize={minimize}
          />
        </Items>
      </List>
    </ScrollbarComponent>
  );
};

export default SidebarNav;
