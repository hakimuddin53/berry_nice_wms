import styled from "@emotion/styled";
import React from "react";
import { Helmet } from "react-helmet-async";

import { Paper, useTheme } from "@mui/material";

import { useTranslation } from "react-i18next";
import SignInComponent from "../../components/auth/SignIn";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function SignIn() {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  return (
    <React.Fragment>
      <Wrapper>
        <Helmet title={t("sign-in")} />
        <div style={{ width: "100%", textAlign: "center" }}>
          {theme.palette.mode !== "dark" ? (
            <img
              alt="Platbricks"
              src="/static/img/logo/platbricks.png"
              height="150px"
            />
          ) : (
            <img
              alt="Platbricks"
              src="/static/img/logo/platbricks_light.png"
              height="150px"
            />
          )}
        </div>

        <SignInComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default SignIn;
