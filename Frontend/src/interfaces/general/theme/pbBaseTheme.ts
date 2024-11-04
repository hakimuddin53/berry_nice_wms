import { Theme, Components } from "@mui/material";
import { KeyValueListProps } from "components/platbricks/shared/KeyValueList";

export interface PbBaseTheme extends Theme {
  components?: PbComponents;
}
export interface PbComponents extends Components {
  KeyValueList?: {
    defaultProps?: KeyValueListProps;
  };
}
