import React from "react";

import { THEMES } from "../constants";

const initialState = {
  theme: THEMES.PLATBRICKS,
  fixedLayout: false,
  setTheme: (theme: string) => {},
  setFixedLayout: (fixedLayout: boolean) => {},
};
const ThemeContext = React.createContext(initialState);

type ThemeProviderProps = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, _setTheme] = React.useState<string>(initialState.theme);
  const [fixedLayout, setFixedLayout] = React.useState<boolean>(false);

  //Ignore stored theme, since we will use only platbricks theme from now on
  // useEffect(() => {
  //   const storedTheme = localStorage.getItem("theme");

  //   if (storedTheme) {
  //     _setTheme(JSON.parse(storedTheme));
  //   }
  // }, []);

  const setTheme = (theme: string) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    _setTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, fixedLayout, setTheme, setFixedLayout }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
