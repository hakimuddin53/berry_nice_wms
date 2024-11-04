import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { GenericIcon, IconName } from "./GenericIcon";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export interface ActionHelper {
  title: string;
  icon?: IconName;
  onclick?: () => void;
  to?: string;
  pageConfigIdentifier?: string;
}

interface ActionsButtonProps {
  actions: ActionHelper[];
}

export default function ActionsButton(props: ActionsButtonProps) {
  const { t } = useTranslation();
  const params = useParams();
  const urlParams = Object.entries(params);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  var defaultActions = props.actions.filter((x) => !x.pageConfigIdentifier);
  var actions: ActionHelper[] = defaultActions;
  var customActions: any[] = [];
  customActions.forEach((x) => {
    var url = x.customUrl;
    urlParams.forEach((x) => {
      url = url?.replaceAll(`:${x[0]}`, x[1] || "");
    });
    actions.push({
      title: x.title,
      to: url,
      icon: x.customIcon,
    });
  });

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls="demo-customized-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {t("common:actions")}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {actions.map((x, i) => {
          if (x.to) {
            return (
              <MenuItem key={i} disableRipple to={x.to} component={Link}>
                {x.icon && <GenericIcon iconName={x.icon} />}
                {x.title}
              </MenuItem>
            );
          } else if (x.onclick) {
            return (
              <MenuItem
                key={i}
                onClick={() => {
                  handleClose();
                  if (x.onclick) {
                    x.onclick();
                  }
                }}
                disableRipple
              >
                {x.icon && <GenericIcon iconName={x.icon} />}
                {x.title}
              </MenuItem>
            );
          } else {
            return (
              <MenuItem key={i} disabled disableRipple>
                {x.icon && <GenericIcon iconName={x.icon} />}
                {x.title}
              </MenuItem>
            );
          }
        })}
      </StyledMenu>
    </div>
  );
}
