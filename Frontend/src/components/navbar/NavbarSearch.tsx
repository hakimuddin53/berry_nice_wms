import styled from "@emotion/styled";
import { InputBase } from "@mui/material";
import useAuth from "hooks/useAuth";
import { dashboardItems } from "layouts/Dashboard";
import { darken } from "polished";
import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "react-feather";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import useKeypress from "react-use-keypress";
import { SidebarItemsType } from "types/sidebar";

const NavbarSearchContainer = styled("div")`
  position: relative;
`;
const NavbarSearchMenu = styled("div")`
  position: absolute;
  transform: translateY(4px);
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
  max-height: 150px;
  background-color: #fff;
  z-index: 99;
`;
const NavbarSearchMenuItem = styled("div")<{ selected?: boolean }>`
  padding: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#eee" : "#fff")};
  color: #9e9e9e;
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;
const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
    width: 160px;
  }
`;

var useSearchOptions = () => {
  const { t } = useTranslation("navbar");
  const [params, setParams] = useSearchParams();
  var { signOut } = useAuth();
  const options: any = {
    sites: [
      /*{
      name: "Inbound Deliveries Overview of location ...",
      shortName: "IDO",
      action: () => {},
      subOptions: [],
    },
    {
      name: "Inbound Delivery Details by Id ...",
      shortName: "IDBI",
      action: () => {},
      subOptions: [],
    },
    {
      name: "Inbound Delivery Details by Number ...",
      shortName: "IDBN",
      action: () => {},
      subOptions: [],
    },
    {
      name: "Create new Inbound Delivery",
      shortName: "CNID",
      action: () => {},
      subOptions: [],
    },
    { name: "Material Overview", shortName: "MO", action: () => {} },*/
    ],
    commands: [
      {
        name: t("logout"),
        action: () => signOut(),
      },
      {
        name: t("reload-page"),
        action: () => window.location.reload(),
      },
      {
        name: t("activate-focus-mode"),
        action: () => {
          params.set("focusmode", "true");
          setParams(params, { replace: true });
        },
      },
      /*{
      name: "Clear Permission Cache",
      shortName: "CPC",
      action: () => {},
      subOptions: [],
    },
    {
      name: "Change Theme",
      shortName: null,
      action: () => {},
      subOptions: [],
    },
    {
      name: "Open recent page...",
      shortName: null,
      action: () => {},
      subOptions: [],
    },*/
    ],
  };

  const navigate = useNavigate();
  const user = useAuth()?.user;

  var addItems = (items: SidebarItemsType[], locationName?: string) => {
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        addItems(
          item.children,
          item.type === "Folder" ? item.title : locationName
        );
      } else if (item.href && item.href !== "#") {
        if (locationName) {
          var option = options.sites.find((x: any) => x.name === item.title);
          if (option) {
            option.subOptions.push({
              name: locationName,
              action: () => navigate(item.href),
            });
          } else {
            options.sites.push({
              name: item.title,
              nameSuffix: t("in-location"),
              subOptionsTitle: t("select-a-location"),
              shortName: "",
              subOptions: [
                { name: locationName, action: () => navigate(item.href) },
              ],
            });
          }
        } else {
          options.sites.push({
            name: item.title,
            action: () => navigate(item.href),
          });
        }
      }
    });
  };
  addItems(dashboardItems);

  return options;
};

const NavbarSearch = () => {
  const { t } = useTranslation("navbar");
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [availableOptions, setAvailableOptions] = useState<any>([]);
  const [availableSubOptions, setAvailableSubOptions] = useState<any>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [subOptionsTitle, setSubOptionsTitle] = useState("");
  const inputContainerRef = useRef<any>();
  const inputRef = useRef<any>();

  var options = useSearchOptions();

  useEffect(() => {
    const handler = (e: any) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target)
      ) {
        handleBlur();
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleEnter = (selectedOption: any) => {
    if (showMenu && selectedOption) {
      if (selectedOption.subOptions && selectedOption.subOptions.length > 0) {
        setSubOptionsTitle(selectedOption.subOptionsTitle);
        setSearchValue("");
        setAvailableSubOptions(selectedOption.subOptions);
        setSelectedOptionIndex(0);
      } else if (selectedOption.action) {
        selectedOption.action();
        handleBlur();
      }
    }
  };

  const handleBlur = () => {
    inputRef.current.blur();
    setShowMenu(false);
    setSearchValue("");
    setAvailableSubOptions([]);
    setSubOptionsTitle("");
    setSearchValue("");
    setSelectedOptionIndex(0);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSelectedOptionIndex(
      (selectedOptionIndex) =>
        (selectedOptionIndex + availableOptions.length) %
        (availableOptions.length || 1)
    );
  }, [selectedOptionIndex]);
  /* eslint-enable */

  useKeypress(["Escape"], (e) => {
    handleBlur();
  });

  useKeypress(["Enter"], (e) => {
    if (inputRef.current !== document.activeElement) {
      return;
    }
    var selectedOption = availableOptions[selectedOptionIndex];
    handleEnter(selectedOption);
  });
  useKeypress(["k"], (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      inputRef.current && inputRef.current.focus();
    }
  });

  useKeypress(["ArrowDown", "ArrowUp"], (e) => {
    e.preventDefault();
    if (e.key === "ArrowDown") {
      setSelectedOptionIndex((option) => option + 1);
    }
    if (e.key === "ArrowUp") {
      setSelectedOptionIndex((option) => option - 1);
    }
  });

  const handleInputFocus = (e: any) => {
    setShowMenu(true);
  };

  const onItemClick = (option: any) => {
    handleEnter(option);
  };

  const onSearch = (e: any) => {
    setSearchValue(e.target.value);
    setSelectedOptionIndex(0);
  };

  const splitContains = (string: string, searchString: string) => {
    var searchElements = searchString.split(" ");
    return searchElements.every((x) =>
      string.toLocaleLowerCase().includes(x.toLocaleLowerCase())
    );
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (availableSubOptions && availableSubOptions.length > 0) {
      setAvailableOptions(
        availableSubOptions
          .filter(
            (x: any) =>
              splitContains(x.name, searchValue) ||
              x.shortName
                ?.toLocaleLowerCase()
                .includes(searchValue.toLocaleLowerCase())
          )
          .slice(0, 5)
      );
    } else if (searchValue.startsWith(">")) {
      var searchCommand = searchValue.slice(1).trim();
      setAvailableOptions(
        options.commands
          .filter(
            (x: any) =>
              splitContains(x.name, searchCommand) ||
              x.shortName
                ?.toLocaleLowerCase()
                .includes(searchCommand.toLocaleLowerCase())
          )
          .slice(0, 5)
          .map((x: any) => ({ ...x, name: "> " + x.name }))
      );
    } else {
      setAvailableOptions(
        options.sites
          .filter(
            (x: any) =>
              splitContains(x.name, searchValue) ||
              x.shortName
                ?.toLocaleLowerCase()
                .includes(searchValue.toLocaleLowerCase())
          )
          .slice(0, 5)
      );
    }
  }, [searchValue, availableSubOptions]);
  /* eslint-enable */

  return (
    <NavbarSearchContainer ref={inputContainerRef}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Input
          placeholder={subOptionsTitle || t("search-ctrl-k")}
          inputRef={inputRef}
          onChange={onSearch}
          value={searchValue}
          onFocus={handleInputFocus}
          style={{ width: 400 }}
        />
      </Search>
      {showMenu && (
        <NavbarSearchMenu>
          {availableOptions.map((option: any, i: number) => (
            <NavbarSearchMenuItem
              onMouseOver={() => setSelectedOptionIndex(i)}
              onClick={() => onItemClick(option)}
              key={option.name + (option.nameSuffix || "")}
              selected={selectedOptionIndex === i}
            >
              {option.name + (option.nameSuffix || "")}
              <div style={{ float: "right" }}>
                {option.shortName?.toLocaleUpperCase()}
              </div>
            </NavbarSearchMenuItem>
          ))}
        </NavbarSearchMenu>
      )}
    </NavbarSearchContainer>
  );
};

export default NavbarSearch;
