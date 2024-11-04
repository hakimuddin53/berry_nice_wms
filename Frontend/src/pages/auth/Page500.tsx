import styled from "@emotion/styled";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button as MuiButton, Typography } from "@mui/material";
import { SpacingProps, spacing } from "@mui/system";
import { useTranslation } from "react-i18next";

interface ButtonProps extends SpacingProps {
  component?: React.ElementType;
  to?: string;
  target?: string;
}

const Button = styled(MuiButton)<ButtonProps>(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page500() {
  const { t } = useTranslation("auth");
  return (
    <Wrapper>
      <Helmet title="500 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        500
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        {t("internal-server-error")}
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        {t("unexpected-error-message")}
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        {t("return-to-website")}
      </Button>
    </Wrapper>
  );
}

export default Page500;
