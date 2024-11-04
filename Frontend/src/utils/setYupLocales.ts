import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "field-required",
    oneOf: ({ values }) => ({
      key: "field-one-of",
      options: { enumValues: values },
    }),
    notOneOf: ({ values }) => ({
      key: "field-not-one-of",
      options: { enumValues: values },
    }),
    notNull: "field-not-null",
    notType: ({ value, type }) => ({
      key: "field-not-type",
      options: { value, type },
    }),
    defined: "field-required",
  },
  string: {
    length: ({ length }) => ({
      key: "field-string-length",
      options: { length },
    }),
    max: ({ max }) => ({ key: "field-string-max", options: { max } }),
    min: ({ min }) => ({ key: "field-string-min", options: { min } }),
    matches: ({ regex }) => ({
      key: "field-matches-regex",
      options: { regex },
    }),
    email: "field-email",
    url: "field-url",
    uuid: "field-uuid",
    trim: "field-string-trim",
    lowercase: "field-string-lowercase",
    uppercase: "field-string-uppercase",
  },
  number: {
    min: ({ min }) => ({ key: "field-number-min", options: { min } }),
    max: ({ max }) => ({ key: "field-number-max", options: { max } }),
    lessThan: ({ less }) => ({
      key: "field-number-less-than",
      options: { less },
    }),
    moreThan: ({ more }) => ({
      key: "field-number-more-than",
      options: { more },
    }),
    positive: "field-number-positive",
    negative: "field-number-negative",
    integer: "field-number-integer",
  },
  date: {
    min: ({ min }) => ({ key: "field-date-min", options: { min } }),
    max: ({ max }) => ({ key: "field-date-max", options: { max } }),
  },
  array: {
    length: ({ length }) => ({
      key: "field-array-length",
      options: { length },
    }),
    min: ({ min }) => ({ key: "field-array-min", options: { min } }),
    max: ({ max }) => ({ key: "field-array-max", options: { max } }),
  },
  boolean: {
    isValue: ({ value }) => ({
      key: "field-boolean-value",
      options: { value },
    }),
  },
});
