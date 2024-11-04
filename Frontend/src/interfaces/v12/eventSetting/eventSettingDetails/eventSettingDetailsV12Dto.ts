import {
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";
import { guid } from "types/guid";

export interface EventSettingDetailsV12Dto {
  id: guid;
  event: EventTypeEnum;
  locationId?: guid;
  locationName?: string;
  actionType: EventActionTypeEnum;
  callbackUrl?: string;
  email?: string;
  emailLanguage?: string;
  businessLogic?: string;
  sequence: number;
  parameter1?: string;
  rowVersion: string;
  createdAt: string;
  createdById: guid;
  changedAt?: string;
  changedById?: guid;
}
