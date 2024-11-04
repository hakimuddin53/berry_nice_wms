import {
  ClickAwayListener,
  Menu,
  MenuList,
  MenuListProps,
  MenuProps,
  Popper,
  styled,
} from "@mui/material";
import { VirtualElement } from "@popperjs/core";

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === "light" ? "#e1e4e8" : "#30363d"}`,
  boxShadow: `0 8px 24px ${
    theme.palette.mode === "light" ? "rgba(149, 157, 165, 0.2)" : "rgb(1, 4, 9)"
  }`,
  borderRadius: 6,
  zIndex: theme.zIndex.appBar - 1,
  fontSize: 13,
  color: theme.palette.mode === "light" ? "#24292e" : "#c9d1d9",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#1c2128",
}));

interface _MenuProps extends MenuProps {
  popVariant: "popover" | undefined;
}
interface _MenuListProps extends MenuListProps {
  popVariant: "popper";
  open: boolean;
  onClose: () => void;
  anchorEl?: null | VirtualElement | (() => VirtualElement);
}
type PbMenuProps = _MenuProps | _MenuListProps;
const PbMenu = (props: PbMenuProps) => {
  if (!props.popVariant || props.popVariant === "popover") {
    const { popVariant, ...menuProps } = props;
    return <Menu {...menuProps}>{props.children}</Menu>;
  }
  if (props.popVariant === "popper") {
    const { anchorEl, open, onClose, popVariant, ...menuListProps } = props;
    return (
      <StyledPopper
        open={props.open}
        anchorEl={props.anchorEl}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={props.onClose}>
          <MenuList autoFocus {...menuListProps}>
            {props.children}
          </MenuList>
        </ClickAwayListener>
      </StyledPopper>
    );
  }
  return <></>;
};

export default PbMenu;
