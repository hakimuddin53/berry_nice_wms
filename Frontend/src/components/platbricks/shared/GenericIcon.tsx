import * as icons from "@mui/icons-material";
export type IconName = keyof typeof icons; // use this in other components

interface IGenericIconProps {
  iconName: IconName;
}

export const GenericIcon = ({ iconName }: IGenericIconProps): JSX.Element => {
  const Icon = icons[iconName];
  return <Icon />;
};
