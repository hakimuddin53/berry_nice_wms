import DisplayName from "components/platbricks/shared/DisplayName";
import useUserCache from "hooks/caches/useUserCache";
import { useEffect, useState } from "react";
import { guid } from "types/guid";

interface UserNameProps {
  userId?: string | guid | null;
  placeholder?: string;
  hideLink?: boolean;
}

const UserName = (props: UserNameProps) => {
  const [getUserById] = useUserCache();
  const [displayText, setDisplayText] = useState("");

  console.log(props.userId);

  useEffect(() => {
    if (props.userId) {
      var { userName } = getUserById(props.userId as guid);
      setDisplayText(userName);
    } else {
      setDisplayText(props.placeholder ? props.placeholder : "");
    }
  }, [props.userId, props.placeholder, getUserById]);

  return <DisplayName displayText={displayText} />;
};

export default UserName;
