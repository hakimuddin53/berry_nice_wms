import { guid } from "../../../../types/guid";

export interface UserDetailsV12Dto {
  id: guid;
  forename: string;
  surname: string;
  locale: string;
  userName: string;
  emailAlternate: string;
  email: string;
  menuId: guid;
  reactHomeMenuItemId: guid | null;
  reactHomeMenuItemLocationId: guid | null;
  phoneNumber: string;
  timeZoneInfoId: string;
  userType: string;
}
