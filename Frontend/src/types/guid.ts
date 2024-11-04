export const guid = (guid: string): guid => {
  if (guid === null) guid = "00000000-0000-0000-0000-000000000000";

  return guid as guid; // maybe add validation that the parameter is an actual guid ?
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type guid = string & { isGuid: true };
/* eslint-enable */

export const generateRandomGuid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  const randomGuiStr =
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4();

  return guid(randomGuiStr);
};

export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
