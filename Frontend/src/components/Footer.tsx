import styled from "@emotion/styled";

import {
  Grid,
  List,
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ListItemButtonProps {
  component?: string;
  href?: string;
  target?: string;
}

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(0.25)}
    ${(props) => props.theme.spacing(4)};
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;

const ListItemButton = styled(MuiListItemButton)<ListItemButtonProps>`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(2)};
  padding-right: ${(props) => props.theme.spacing(2)};

  &,
  &:hover,
  &:active {
    color: #ff0000;
  }
`;

const ListItemText = styled(MuiListItemText)`
  span {
    color: ${(props) => props.theme.footer.color};
  }
`;

const LangdonButton = styled(ListItemButton)`
  z-index: -1;
  &:focus {
    z-index: 0;
  }
`;

function Footer() {
  const { t } = useTranslation("navbar");
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Grid
          sx={{ display: { xs: "none", md: "block" } }}
          container
          item
          xs={12}
          md={6}
        >
          <List>
            {/*
              <ListItemButton component="a" href="#">
                <ListItemText primary="Support" />
              </ListItemButton>
              <ListItemButton component="a" href="#">
                <ListItemText primary="Help Center" />
              </ListItemButton>
             */}
            <ListItemButton
              component="a"
              target="_blank"
              href="https://legallinkingkit.arvato-systems.de/api/Documents/989d9520-fa89-4f4f-9046-1f159ffab3a5"
            >
              <ListItemText primary={t("terms-of-usage")} />
            </ListItemButton>
            <ListItemButton
              component="a"
              target="_blank"
              href="https://www.arvato-systems.com/imprint"
            >
              <ListItemText primary={t("imprint")} />
            </ListItemButton>
            <LangdonButton component="a" href="#Will be 23 on April 24th">
              <ListItemText primary="Langdon's Birthday" />
            </LangdonButton>
          </List>
        </Grid>
        <Grid container item xs={12} md={6} justifyContent="flex-end">
          <List>
            <ListItemButton>
              <ListItemText
                primary={`© ${new Date().getFullYear()} - Arvato Systems`}
              />
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
