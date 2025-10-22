import styled from "@emotion/styled";
import React from "react";
import { Outlet } from "react-router-dom";

import { CssBaseline } from "@mui/material";

import GlobalStyle from "../components/GlobalStyle";

import Box from "@mui/material/Box";

const Root = styled.div`
  max-width: 520px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("/static/img/backgrounds/bg_main_1.jpg") no-repeat;
  background-size: cover;
  background-position: center;
`;

const SideBrandBox = styled(Box)`
  position: absolute;
  right: 0;
  top: 50px;
`;

interface AuthType {
  children?: React.ReactNode;
}
const Auth: React.FC<AuthType> = ({ children }) => {
  return (
    <PageWrapper>
      <Root>
        <CssBaseline />
        <GlobalStyle />
        {children}
        <Outlet />
        {/* <Settings /> */}
      </Root>
    </PageWrapper>
  );
};

export default Auth;
