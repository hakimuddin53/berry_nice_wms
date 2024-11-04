import "@mui/lab/themeAugmentation";
import { PaletteColorOptions, createTheme } from "@mui/material/styles";
import breakpoints from "./breakpoints";
import components from "./components";
import shadows from "./shadows";
import typography from "./typography";
import variants, { platbricksVariant } from "./variants";

declare module "@mui/material/styles" {
  interface Palette {
    default: PaletteColorOptions;
  }
  interface PaletteOptions {
    default: PaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    default: true;
  }
}

const { palette } = createTheme();

const configureTheme = (name: string) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = platbricksVariant;
  }

  return createTheme(
    {
      spacing: 4,
      breakpoints: breakpoints,
      // @ts-ignore
      components: components,
      typography: typography,
      shadows: shadows,
      palette: {
        ...themeConfig.palette,
        default: palette.augmentColor({
          color: {
            main: "#616161",
          },
        }),
      },
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
    }
  );
};

export default configureTheme;
