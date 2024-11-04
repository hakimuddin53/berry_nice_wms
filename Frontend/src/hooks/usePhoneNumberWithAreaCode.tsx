import { isValidPhoneNumber } from "libphonenumber-js";
import { useNotificationService } from "services/NotificationService";
import {
  hasCountryCode,
  removeLeadingZeros,
  validateParseAndExtractCountryCallingCode,
} from "utils/helper";

export const usePhoneNumberWithAreaCode = () => {
  const notificationService = useNotificationService();

  const getPhoneNumber = (phoneNumber: string): string => {
    if (hasCountryCode(phoneNumber)) {
      return phoneNumber;
    } else {
      return removeLeadingZeros(phoneNumber ?? "");
    }
  };

  const getPhoneNumberAreaCode = (phoneNumber: string): string => {
    const parseNumber = validateParseAndExtractCountryCallingCode(
      phoneNumber ?? ""
    );

    if (parseNumber.valid) {
      if (parseNumber.countryCallingCode) {
        return parseNumber.countryCallingCode;
      }
    }
    return "";
  };

  const validatePhoneNumber = (phoneNumber: string, areaCode: string) => {
    // if both feild is empty we do not validate the phone number, the required part should be handled in the component
    if (!phoneNumber && !areaCode) {
      return true;
    } else if (!phoneNumber || !areaCode) {
      notificationService.handleErrorMessage(
        "Please input value for both phone number and area code"
      );
      return false;
    }

    const valid = isValidPhoneNumber(areaCode + phoneNumber);
    if (!valid) {
      notificationService.handleErrorMessage("The phone number is not valid");
      return false;
    }

    return true;
  };

  return { getPhoneNumber, getPhoneNumberAreaCode, validatePhoneNumber };
};
