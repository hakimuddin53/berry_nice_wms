import {
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";
import * as yup from "yup";

export const eventSettingCreateEditShema = yup.object({
  event: yup
    .mixed<EventTypeEnum>()
    .notOneOf([EventTypeEnum.UNSPECIFIED])
    .required(),
  locationId: yup.string().nullable(),
  actionType: yup
    .mixed<EventActionTypeEnum>()
    .notOneOf([EventActionTypeEnum.UNSPECIFIED])
    .required(),
  callbackUrl: yup
    .string()
    .nullable()
    .when("actionType", {
      is: EventActionTypeEnum.CALLBACK,
      then: (schema) => schema.required(),
    }),
  emails: yup
    .array()
    .of(yup.string().required().email())
    .when("actionType", {
      is: EventActionTypeEnum.EMAIL,
      then: (schema) => schema.required().min(1),
    }),
  email: yup
    .string()
    .nullable()
    .when("actionType", {
      is: EventActionTypeEnum.EMAIL,
      then: (schema) => schema.required(),
    }),
  emailLanguage: yup
    .string()
    .nullable()
    .when("actionType", {
      is: EventActionTypeEnum.EMAIL,
      then: (schema) => schema.required(),
    }),
  businessLogic: yup
    .string()
    .nullable()
    .when("actionType", {
      is: EventActionTypeEnum.BUSINESS_LOGIC,
      then: (schema) => schema.required(),
    }),
  sequence: yup.number().nonNullable().required(),
  parameter1: yup.string().nullable(),
});

export type YupEventSettingCreateEdit = yup.InferType<
  typeof eventSettingCreateEditShema
>;
