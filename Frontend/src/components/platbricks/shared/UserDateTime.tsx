import { useUserDateTime } from "hooks/useUserDateTime";
import { DisplayType } from "interfaces/enums/DateDisplayTypeEnum";

interface UserDateTimeProps {
  date?: string | null;
  displayType?: DisplayType;
  placeholder?: string;
}

const UserDateTime = (props: UserDateTimeProps) => {
  const { getLocalDateAndTime, getLocalDate, getLocalTime } = useUserDateTime();
  const placeholder = props.placeholder ? props.placeholder : "";

  const getDateTime = () => {
    switch (props?.displayType ?? DisplayType.DATETIME) {
      case DisplayType.DATEONLY:
        return props.date ? getLocalDate(props.date) : placeholder;
      case DisplayType.TIMEONLY:
        return props.date ? getLocalTime(props.date) : placeholder;
      case DisplayType.DATETIME:
        return props.date ? getLocalDateAndTime(props.date) : placeholder;
    }
  };

  return <>{getDateTime()}</>;
};

export default UserDateTime;
