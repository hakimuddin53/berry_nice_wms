import { TFunction } from "i18next";
import { ValidationResult } from "interfaces/v12/exceptions/HttpResponseMessageV12Dto";
import { tryParse } from "./json";
import { format } from "./stringFormatter";

const formatPath = (path: (string | number)[]) => {
  if (path.length === 0) return "";
  const formatSegment = (segment: string | number) => {
    if (typeof segment === "number") {
      return `#${segment + 1}`;
    }
    const spaced = segment
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_-]/g, " ")
      .trim();
    if (!spaced) {
      return segment;
    }
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };
  return path.map(formatSegment).join(" > ");
};

export const flattenFormikErrors = (
  errors: any,
  path: (string | number)[] = []
): string[] => {
  if (!errors) return [];

  if (typeof errors === "string") {
    const label = formatPath(path);
    return [label ? `${label}: ${errors}` : errors];
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((err, index) =>
      flattenFormikErrors(err, [...path, index])
    );
  }

  if (typeof errors === "object") {
    return Object.entries(errors).flatMap(([key, value]) =>
      flattenFormikErrors(value, [...path, key])
    );
  }

  return [];
};

export const extractApiErrorMessages = (
  error: any,
  t: TFunction,
  translationNamespace = "common"
): string[] => {
  const addMessage = (msg?: string) => {
    const trimmed = typeof msg === "string" ? msg.trim() : "";
    if (trimmed) {
      messages.push(trimmed);
    }
  };

  const messages: string[] = [];
  const data = error?.data ?? error?.response?.data ?? error;

  if (data?.message) {
    addMessage(
      t(data.message, {
        ns: translationNamespace,
        defaultValue: data.message,
      })
    );
  }

  if (data?.subMessages?.length) {
    data.subMessages.forEach((sub: any) => {
      addMessage(
        t(sub?.message, {
          ns: translationNamespace,
          defaultValue: sub?.message,
        })
      );
    });
  }

  if (data?.responseMessageAttributes?.length) {
    data.responseMessageAttributes.forEach((message: any) => {
      const parsed: ValidationResult | undefined = tryParse(message?.value);
      if (parsed && typeof parsed === "object" && parsed.errorCode) {
        const args = parsed.arguments ?? [];
        const translated = format(
          t(parsed.errorCode, {
            ns: "validationResult",
            defaultValue: parsed.errorCode,
          }),
          ...args.map((arg: any) =>
            t(String(arg), {
              ns: translationNamespace,
              defaultValue: String(arg),
            })
          )
        );
        addMessage(translated);
      } else if (typeof message?.value === "string") {
        addMessage(message.value);
      }
    });
  }

  if (messages.length === 0 && typeof data === "string") {
    addMessage(data);
  }

  if (messages.length === 0 && error?.message) {
    addMessage(error.message);
  }

  if (messages.length === 0) {
    addMessage(t("common:request-failed", { defaultValue: "Request failed" }));
  }

  return Array.from(new Set(messages));
};
