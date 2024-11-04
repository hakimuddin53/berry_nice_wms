import {
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";

export interface EventSettingCreateV12Dto {
  event: EventTypeEnum;
  locationId?: string | null;
  actionType: EventActionTypeEnum;
  callbackUrl?: string | null;
  email?: string | null;
  emailLanguage?: string | null;
  businessLogic?: string | null;
  sequence: number;
  parameter1?: string | null;
}
