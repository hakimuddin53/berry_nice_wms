import { MenuItem, Select, SelectProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const colors = [
  { label: "white", value: "#ffffff" },
  { label: "whitesmoke", value: "#f5f5f5" },
  { label: "gainsboro", value: "#dcdcdc" },
  { label: "lightgrey", value: "#d3d3d3" },
  { label: "lightgray", value: "#d3d3d3" },
  { label: "silver", value: "#c0c0c0" },
  { label: "darkgrey", value: "#a9a9a9" },
  { label: "darkgray", value: "#a9a9a9" },
  { label: "gray", value: "#808080" },
  { label: "grey", value: "#808080" },
  { label: "dimgrey", value: "#696969" },
  { label: "dimgray", value: "#696969" },
  { label: "black", value: "#000000" },
  { label: "snow", value: "#fffafa" },
  { label: "lightcoral", value: "#f08080" },
  { label: "rosybrown", value: "#bc8f8f" },
  { label: "indianred", value: "#cd5c5c" },
  { label: "red", value: "#ff0000" },
  { label: "firebrick", value: "#b22222" },
  { label: "brown", value: "#a52a2a" },
  { label: "darkred", value: "#8b0000" },
  { label: "maroon", value: "#800000" },
  { label: "mistyrose", value: "#ffe4e1" },
  { label: "salmon", value: "#fa8072" },
  { label: "tomato", value: "#ff6347" },
  { label: "darksalmon", value: "#e9967a" },
  { label: "coral", value: "#ff7f50" },
  { label: "orangered", value: "#ff4500" },
  { label: "lightsalmon", value: "#ffa07a" },
  { label: "sienna", value: "#a0522d" },
  { label: "seashell", value: "#fff5ee" },
  { label: "chocolate", value: "#d2691e" },
  { label: "saddlebrown", value: "#8b4513" },
  { label: "peachpuff", value: "#ffdab9" },
  { label: "sandybrown", value: "#f4a460" },
  { label: "linen", value: "#faf0e6" },
  { label: "peru", value: "#cd853f" },
  { label: "bisque", value: "#ffe4c4" },
  { label: "darkorange", value: "#ff8c00" },
  { label: "antiquewhite", value: "#faebd7" },
  { label: "burlywood", value: "#deb887" },
  { label: "tan", value: "#d2b48c" },
  { label: "blanchedalmond", value: "#ffebcd" },
  { label: "navajowhite", value: "#ffdead" },
  { label: "papayawhip", value: "#ffefd5" },
  { label: "moccasin", value: "#ffe4b5" },
  { label: "oldlace", value: "#fdf5e6" },
  { label: "wheat", value: "#f5deb3" },
  { label: "orange", value: "#ffa500" },
  { label: "floralwhite", value: "#fffaf0" },
  { label: "goldenrod", value: "#daa520" },
  { label: "darkgoldenrod", value: "#b8860b" },
  { label: "cornsilk", value: "#fff8dc" },
  { label: "gold", value: "#ffd700" },
  { label: "lemonchiffon", value: "#fffacd" },
  { label: "khaki", value: "#f0e68c" },
  { label: "palegoldenrod", value: "#eee8aa" },
  { label: "darkkhaki", value: "#bdb76b" },
  { label: "ivory", value: "#fffff0" },
  { label: "lightyellow", value: "#ffffe0" },
  { label: "beige", value: "#f5f5dc" },
  { label: "lightgoldenrodyellow", value: "#fafad2" },
  { label: "yellow", value: "#ffff00" },
  { label: "olive", value: "#808000" },
  { label: "yellowgreen", value: "#9acd32" },
  { label: "olivedrab", value: "#6b8e23" },
  { label: "darkolivegreen", value: "#556b2f" },
  { label: "greenyellow", value: "#adff2f" },
  { label: "chartreuse", value: "#7fff00" },
  { label: "lawngreen", value: "#7cfc00" },
  { label: "honeydew", value: "#f0fff0" },
  { label: "palegreen", value: "#98fb98" },
  { label: "lightgreen", value: "#90ee90" },
  { label: "darkseagreen", value: "#8fbc8f" },
  { label: "limegreen", value: "#32cd32" },
  { label: "lime", value: "#00ff00" },
  { label: "forestgreen", value: "#228b22" },
  { label: "green", value: "#008000" },
  { label: "darkgreen", value: "#006400" },
  { label: "seagreen", value: "#2e8b57" },
  { label: "mediumseagreen", value: "#3cb371" },
  { label: "mintcream", value: "#f5fffa" },
  { label: "springgreen", value: "#00ff7f" },
  { label: "mediumspringgreen", value: "#00fa9a" },
  { label: "aquamarine", value: "#7fffd4" },
  { label: "mediumaquamarine", value: "#66cdaa" },
  { label: "turquoise", value: "#40e0d0" },
  { label: "lightseagreen", value: "#20b2aa" },
  { label: "mediumturquoise", value: "#48d1cc" },
  { label: "azure", value: "#f0ffff" },
  { label: "lightcyan", value: "#e0ffff" },
  { label: "paleturquoise", value: "#afeeee" },
  { label: "cyan", value: "#00ffff" },
  { label: "aqua", value: "#00ffff" },
  { label: "darkcyan", value: "#008b8b" },
  { label: "darkslategrey", value: "#2f4f4f" },
  { label: "darkslategray", value: "#2f4f4f" },
  { label: "teal", value: "#008080" },
  { label: "darkturquoise", value: "#00ced1" },
  { label: "cadetblue", value: "#5f9ea0" },
  { label: "powderblue", value: "#b0e0e6" },
  { label: "lightblue", value: "#add8e6" },
  { label: "deepskyblue", value: "#00bfff" },
  { label: "skyblue", value: "#87ceeb" },
  { label: "lightskyblue", value: "#87cefa" },
  { label: "steelblue", value: "#4682b4" },
  { label: "aliceblue", value: "#f0f8ff" },
  { label: "dodgerblue", value: "#1e90ff" },
  { label: "lightslategray", value: "#778899" },
  { label: "lightslategrey", value: "#778899" },
  { label: "slategray", value: "#708090" },
  { label: "slategrey", value: "#708090" },
  { label: "lightsteelblue", value: "#b0c4de" },
  { label: "cornflowerblue", value: "#6495ed" },
  { label: "royalblue", value: "#4169e1" },
  { label: "ghostwhite", value: "#f8f8ff" },
  { label: "lavender", value: "#e6e6fa" },
  { label: "blue", value: "#0000ff" },
  { label: "mediumblue", value: "#0000cd" },
  { label: "midnightblue", value: "#191970" },
  { label: "darkblue", value: "#00008b" },
  { label: "navy", value: "#000080" },
  { label: "slateblue", value: "#6a5acd" },
  { label: "darkslateblue", value: "#483d8b" },
  { label: "mediumslateblue", value: "#7b68ee" },
  { label: "mediumpurple", value: "#9370db" },
  { label: "blueviolet", value: "#8a2be2" },
  { label: "indigo", value: "#4b0082" },
  { label: "darkorchid", value: "#9932cc" },
  { label: "darkviolet", value: "#9400d3" },
  { label: "mediumorchid", value: "#ba55d3" },
  { label: "thistle", value: "#d8bfd8" },
  { label: "plum", value: "#dda0dd" },
  { label: "violet", value: "#ee82ee" },
  { label: "magenta", value: "#ff00ff" },
  { label: "fuchsia", value: "#ff00ff" },
  { label: "darkmagenta", value: "#8b008b" },
  { label: "purple", value: "#800080" },
  { label: "orchid", value: "#da70d6" },
  { label: "mediumvioletred", value: "#c71585" },
  { label: "deeppink", value: "#ff1493" },
  { label: "hotpink", value: "#ff69b4" },
  { label: "lavenderblush", value: "#fff0f5" },
  { label: "palevioletred", value: "#db7093" },
  { label: "crimson", value: "#dc143c" },
  { label: "pink", value: "#ffc0cb" },
  { label: "lightpink", value: "#ffb6c1" },
];

export const getFontColor = (hexColorCode: string, threshold?: number) => {
  if (hexColorCode.length === 7 && hexColorCode.startsWith("#")) {
    const red = parseInt(hexColorCode.substring(1, 3), 16);
    const green = parseInt(hexColorCode.substring(3, 5), 16);
    const blue = parseInt(hexColorCode.substring(5, 7), 16);
    if (red * 0.299 + green * 0.587 + blue * 0.114 < (threshold ?? 200)) {
      return "white";
    }
  }
  return "black";
};

type ColorSelectProps = SelectProps;
const ColorSelect = (props: ColorSelectProps) => {
  const { t } = useTranslation();
  return (
    <Select
      label={props.label ? props.label : t("color")}
      size="small"
      {...props}
    >
      <MenuItem
        value=""
        key="transparent"
        style={{
          backgroundColor: "transparent",
        }}
      >
        transparent
      </MenuItem>
      {colors.map((c) => (
        <MenuItem
          value={c.value}
          key={c.label}
          style={{
            backgroundColor: c.value,
            color: getFontColor(c.value),
          }}
        >
          {c.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ColorSelect;
