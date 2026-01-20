import { FilterList, FilterListOff, Settings } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";
import { spacing } from "@mui/system";
import React, { ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as NavLink } from "react-router-dom";
import ActionsButton, { ActionHelper } from "./ActionsButton";
import { GenericIcon } from "./GenericIcon";

interface PageHeaderProps {
  children?: React.ReactNode;
  pagename?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcumb[];
  actions?: ActionHelper[];
  hasSingleActionButton?: boolean;
  showBackdrop?: boolean;
  showLoading?: boolean;
  parametersModal?: any;
  disable?: boolean;
  showSearch?: boolean; // indicates page supports search toggle
  renderSearch?: () => ReactElement<any>;
  onParametersModalClose?: () => void;
}
interface Breadcumb {
  label: string;
  to?: string;
}

const PageBackdrop = styled(Backdrop)``;

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Page: React.FC<PageHeaderProps> = (props) => {
  const [showParametersModal, setShowParametersModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const showLoading = props.showLoading;
  const hasSearch = props.showSearch && !!props.renderSearch;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {props.parametersModal && (
        <props.parametersModal
          open={showParametersModal}
          onClose={() => {
            setShowParametersModal(false);
            props.onParametersModalClose && props.onParametersModalClose();
          }}
        ></props.parametersModal>
      )}
      <PageBackdrop
        sx={{
          color: "#fff",
          zIndex: (theme: any) => theme.zIndex.drawer + 1,
        }}
        open={!!props.showBackdrop}
      >
        <CircularProgress color="inherit" />
      </PageBackdrop>
      <Helmet
        title={props.pagename || `${props.title} ${props.subtitle || ""}`}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <Typography variant="h3" gutterBottom display="inline" mr={2}>
            {showLoading ? (
              <Skeleton
                variant="text"
                style={{ display: "inline-flex" }}
                width={200}
              />
            ) : (
              props.title.split("<br/>").map((item, index) => {
                return (
                  <span key={index}>
                    {item}
                    <br />
                  </span>
                );
              })
            )}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="light"
            gutterBottom
            display="inline"
          >
            {showLoading ? (
              <Skeleton
                variant="text"
                style={{ display: "inline-flex" }}
                width={150}
              />
            ) : (
              props.subtitle
            )}
          </Typography>

          {props.breadcrumbs && (
            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
              {showLoading ? (
                <Skeleton variant="text" width={300} />
              ) : (
                props.breadcrumbs.map((item, index) => {
                  return item.to ? (
                    <Link component={NavLink} to={item.to} key={index}>
                      {item.label}
                    </Link>
                  ) : (
                    <Typography key={index}>{item.label}</Typography>
                  );
                })
              )}
            </Breadcrumbs>
          )}
        </div>
        <div>
          {props.parametersModal && (
            <IconButton
              onClick={() => setShowParametersModal(true)}
              color="inherit"
              size="small"
              style={{ marginRight: 5 }}
            >
              <Settings />
            </IconButton>
          )}
          {hasSearch && (
            <IconButton
              onClick={() => setShowSearch((s) => !s)}
              color="inherit"
              size="small"
              style={{ marginRight: 5 }}
            >
              {showSearch ? <FilterListOff /> : <FilterList />}
            </IconButton>
          )}
          {props.actions &&
            props.hasSingleActionButton &&
            props.actions[0] &&
            props.actions[0].to && (
              <Button
                disableElevation
                disabled={props.disable ?? false}
                variant="contained"
                startIcon={
                  props.actions[0].icon && (
                    <GenericIcon iconName={props.actions[0].icon}></GenericIcon>
                  )
                }
                component={NavLink}
                to={props.actions[0].to}
              >
                {props.actions[0].title}
              </Button>
            )}
          {props.actions &&
            props.hasSingleActionButton &&
            props.actions[0] &&
            !props.actions[0].to && (
              <Button
                disableElevation
                variant="contained"
                disabled={props.disable ?? false}
                onClick={props.actions[0].onclick}
                startIcon={
                  props.actions[0].icon && (
                    <GenericIcon iconName={props.actions[0].icon}></GenericIcon>
                  )
                }
              >
                {props.actions[0].title}
              </Button>
            )}
          {props.actions &&
            props.actions.length > 0 &&
            !props.hasSingleActionButton && (
              <ActionsButton actions={props.actions} />
            )}
        </div>
      </Box>
      <Divider my={4} />
      {showLoading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : (
        <div style={{ overflow: "auto", flexGrow: 1 }}>
          {showSearch && props.renderSearch?.()}
          {props.children}
        </div>
      )}
    </div>
  );
};

export default Page;
