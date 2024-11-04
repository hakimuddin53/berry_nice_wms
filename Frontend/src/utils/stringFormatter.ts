import { MonthEnum } from "interfaces/enums/GlobalEnums";

const format = (message: string, ...replacements: string[]) => {
  var args = replacements;
  return message.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
};

const formatMonthToDigits = (month: MonthEnum) => {
  return new Date(`${month}-1-01`).toLocaleDateString(`en`, {
    month: `2-digit`,
  });
};

export { format, formatMonthToDigits };
