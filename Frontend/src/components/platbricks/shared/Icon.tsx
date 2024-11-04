import * as MuiIcon from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";

interface IconProps extends SvgIconProps {
  icon?: string;
}
const Icon = (props: IconProps) => {
  const { icon, ...iconProps } = props;
  if (icon && icon in MuiIcon) {
    const Icon = MuiIcon[icon as keyof typeof MuiIcon];
    return <Icon {...iconProps} />;
  }
  return <></>;
};

export default Icon;
