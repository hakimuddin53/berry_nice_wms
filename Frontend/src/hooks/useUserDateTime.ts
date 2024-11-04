import useAuth from "./useAuth";

export const useUserDateTime = () => {
  const { user } = useAuth();

  const getLocalDateAndTime = (date: string) => {
    return new Date(date).toLocaleString(user?.locale);
  };

  const getLocalDate = (date: string) => {
    return new Date(date).toLocaleDateString(user?.locale);
  };

  const getLocalTime = (date: string) => {
    return new Date(date).toLocaleTimeString(user?.locale);
  };

  const isIsoDate = (date: string) => {
    const _regExp = new RegExp(
      "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$"
    );
    return _regExp.test(date);
  };

  return { getLocalDateAndTime, getLocalDate, getLocalTime, isIsoDate };
};
