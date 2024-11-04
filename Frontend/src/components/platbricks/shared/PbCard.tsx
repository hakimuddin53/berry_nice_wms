import {
  CardContent,
  Card as MuiCard,
  Toolbar,
  Typography,
} from "@mui/material";

export interface PbCardProps {
  paddingEnabled?: boolean;
}
export const PbCard: React.FunctionComponent<PbCardProps & any> = (props) => {
  const { children, paddingEnabled, ...otherProps } = props;
  return (
    <MuiCard {...otherProps}>
      <CardContent sx={paddingEnabled === false ? { p: 0 } : undefined}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export const PbCardHeader: React.FunctionComponent<any> = (props) => {
  const { children, ...otherProps } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2, md: 3 },
        pr: { xs: 1, sm: 1 },
        flex: "1 1 100%",
        justifyContent: "space-between",
        minHeight: "45px !important",
      }}
      {...otherProps}
    >
      {children}
    </Toolbar>
  );
};

export const PbCardBody: React.FunctionComponent<any> = (props) => {
  const { children, ...otherProps } = props;
  return <div {...otherProps}>{children}</div>;
};

export const PbCardTitle: React.FunctionComponent<any> = (props) => {
  const { children, ...otherProps } = props;
  return (
    <Typography gutterBottom variant="h5" component="div" {...otherProps}>
      {children}
    </Typography>
  );
};

export const PbCardActions: React.FunctionComponent<any> = (props) => {
  const { children, ...otherProps } = props;
  return <div {...otherProps}>{children}</div>;
};
