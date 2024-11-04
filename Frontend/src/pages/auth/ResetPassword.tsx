import styled from "@emotion/styled";
import React from "react";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import ResetPasswordComponent from "../../components/auth/ResetPassword";
import { ReactComponent as Logo } from "../../vendor/logo.svg";

const Brand = styled(Logo)`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 64px;
  height: 64px;
  margin-bottom: 32px;
`;

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
  const { t } = useTranslation("auth");
  return (
    <React.Fragment>
      <Brand />
      <Wrapper>
        <Helmet title={t("reset-password")} />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t("reset-password")}
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          {t("enter-your-email-to-reset-your-password")}
        </Typography>

        <ResetPasswordComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default ResetPassword;
