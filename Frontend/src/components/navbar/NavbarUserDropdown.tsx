import styled from "@emotion/styled";
import React from "react";
import { Power } from "react-feather";
import { useNavigate } from "react-router-dom";

import { Menu, MenuItem, IconButton as MuiIconButton } from "@mui/material";

import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const { t } = useTranslation("navbar");

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  return (
    <React.Fragment>
      <IconButton
        aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={toggleMenu}
        color="inherit"
        size="large"
      >
        <Power />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {/*<MenuItem onClick={closeMenu}>Profile</MenuItem>*/}
        <MenuItem onClick={handleSignOut}>{t("sign-out")}</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
