import styled from "@emotion/styled";
import {
  Grid,
  List,
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import { useMemo } from "react";
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

const Footer = () => {
  const { t } = useTranslation("navbar");
  const userLabel = useMemo(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) return "";
    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] ||
        decoded.email ||
        decoded.sub ||
        decoded.name ||
        ""
      );
    } catch {
      return "";
    }
  }, []);

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
            <ListItemButton component="a" target="_blank">
              <ListItemText primary={t("terms-of-usage")} />
            </ListItemButton>
            <ListItemButton component="a" target="_blank">
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
                primary={`© ${new Date().getFullYear()} - Berry Nice`}
              />
            </ListItemButton>
            {userLabel && (
              <ListItemButton>
                <ListItemText primary={`Logged in as: ${userLabel}`} />
              </ListItemButton>
            )}
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Footer;
