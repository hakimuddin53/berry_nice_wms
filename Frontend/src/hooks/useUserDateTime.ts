import useAuth from "./useAuth";

export const useUserDateTime = () => {
  const { user } = useAuth();
  console.log(user);
  const locale = "en-MY";
  const timeZone = "Asia/Kuala_Lumpur";

  const getLocalDateAndTime = (date: string) => {
    console.log("getLocalDateAndTime", date);
    console.log(
      "getLocalDateAndTime",
      new Date(date).toLocaleString(locale, { timeZone })
    );

    const normalizedUtcDateString = date.endsWith("Z") ? date : date + "Z";
    const normalizeDate = new Date(normalizedUtcDateString);

    return normalizeDate.toLocaleString(locale, { timeZone });
  };

  const getLocalDate = (date: string) => {
    const normalizedUtcDateString = date.endsWith("Z") ? date : date + "Z";
    const normalizeDate = new Date(normalizedUtcDateString);

    return normalizeDate.toLocaleDateString(locale, { timeZone });
  };

  const getLocalTime = (date: string) => {
    const normalizedUtcDateString = date.endsWith("Z") ? date : date + "Z";
    const normalizeDate = new Date(normalizedUtcDateString);
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
