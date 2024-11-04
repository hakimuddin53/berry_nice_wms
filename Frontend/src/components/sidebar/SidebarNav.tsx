import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Grid, IconButton, List, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import ReactPerfectScrollbar from "react-perfect-scrollbar";

import { SidebarItemsType } from "../../types/sidebar";
import SidebarNavSection from "./SidebarNavSection";

import { IndeterminateCheckBoxOutlined } from "@mui/icons-material";
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

  return (
    <ScrollbarComponent>
      <List disablePadding>
        <Items>
          <Grid container alignItems="center">
            <Grid item xs={10} />
            <Grid item>
              <Tooltip title={t("common:collapse-all")}>
                <IconButton
                  aria-haspopup="true"
                  size="medium"
                  style={{ color: "white" }}
                  onClick={minimizeMenuItems}
                >
                  <IndeterminateCheckBoxOutlined />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <SidebarNavSection
            component="div"
            pages={items}
            minimize={minimize}
          />
        </Items>
      </List>
    </ScrollbarComponent>
  );
};

export default SidebarNav;
