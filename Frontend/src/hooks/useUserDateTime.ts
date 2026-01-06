export const useUserDateTime = () => {
  const locale = "en-MY";
  const timeZone = "Asia/Kuala_Lumpur";

  const normalizeToDate = (date: string | Date) => {
    if (date instanceof Date) {
      return date;
    }
    const normalizedUtcDateString = date.endsWith("Z") ? date : date + "Z";
    return new Date(normalizedUtcDateString);
  };

  const getLocalDateAndTime = (date: string | Date) => {
    const normalizeDate = normalizeToDate(date);

    return normalizeDate.toLocaleString(locale, { timeZone });
  };

  const getLocalDate = (date: string | Date) => {
    const normalizeDate = normalizeToDate(date);

    return normalizeDate.toLocaleDateString(locale, { timeZone });
  };

  const getLocalTime = (date: string | Date) => {
    const normalizeDate = normalizeToDate(date);
    return normalizeDate.toLocaleTimeString(locale, { timeZone });
  };

  const isIsoDate = (date: string) => {
    const _regExp = new RegExp(
      "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$"
    );
    return _regExp.test(date);
  };

  return { getLocalDateAndTime, getLocalDate, getLocalTime, isIsoDate };
};
