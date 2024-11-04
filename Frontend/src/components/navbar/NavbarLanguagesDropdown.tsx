import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  Tooltip,
} from "@mui/material";
import useAuth from "hooks/useAuth";
import { useUserService } from "services/UserService";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

type languageOptionsType = {
  [key: string]: {
    icon: string;
    name: string;
  };
};

const languageOptions: languageOptionsType = {
  "de-DE": {
    icon: "/static/img/flags/de.png",
    name: "german",
  },
  "en-US": {
    icon: "/static/img/flags/us.png",
    name: "english-us",
  },
  "en-GB": {
    icon: "/static/img/flags/gb.png",
    name: "english-gb",
  },
  "es-ES": {
    icon: "/static/img/flags/es.png",
    name: "spain",
  },
};

function NavbarLanguagesDropdown() {
  const { i18n, t } = useTranslation("auth");
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const UserService = useUserService();
  const { updateLocale } = useAuth();

  const selectedLanguage = languageOptions[i18n.language];

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    closeMenu();
    updateLocale(language);
    UserService.updateUserLocale({ locale: language });
  };

  return (
    <React.Fragment>
      <Tooltip title={t("common:language")}>
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Flag src={selectedLanguage.icon} alt={selectedLanguage.name} />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            {t(languageOptions[language].name)}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default NavbarLanguagesDropdown;
