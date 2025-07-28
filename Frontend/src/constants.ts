// Themes
export const THEMES = {
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
  PLATBRICKS: "PLATBRICKS",
};

export const getChipColor = (
  status: string
): "default" | "primary" | "secondary" | "error" => {
  console.log("getChipColor called with status:", status);
  switch (status) {
    case "ACTIVE":
      return "primary";
    case "FULFILLED":
      return "secondary";
    case "CANCELREQUESTED":
    case "CANCELLED":
      return "error";
    case "RELEASED":
      return "default";
    default:
      return "default";
  }
};
