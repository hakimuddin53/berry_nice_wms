import DisplayName from "components/platbricks/shared/DisplayName";
import useLocationCache from "hooks/caches/useLocationCache";
import { useEffect, useState } from "react";
import { guid } from "types/guid";

interface LocationNameProps {
  locationId?: string | guid | null;
  placeholder?: string;
}

const LocationName = (props: LocationNameProps) => {
  const [getLocationById] = useLocationCache();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (props.locationId) {
      const { name } = getLocationById(props.locationId as guid);
      setDisplayText(name);
    } else {
      setDisplayText(props.placeholder ? props.placeholder : "");
    }
  }, [props.locationId, props.placeholder, getLocationById]);

  return <DisplayName displayText={displayText} />;
};

export default LocationName;
