import DisplayName from "components/platbricks/shared/DisplayName";
import useWarehouseCache from "hooks/caches/useWarehouseCache";
import { useEffect, useState } from "react";
import { guid } from "types/guid";

interface WarehouseNameProps {
  warehouseId?: string | guid | null;
  placeholder?: string;
}

const WarehouseName = (props: WarehouseNameProps) => {
  const [getWarehouseById] = useWarehouseCache();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (props.warehouseId) {
      const { name } = getWarehouseById(props.warehouseId as guid);
      setDisplayText(name);
    } else {
      setDisplayText(props.placeholder ? props.placeholder : "");
    }
  }, [props.warehouseId, props.placeholder, getWarehouseById]);

  return <DisplayName displayText={displayText} />;
};

export default WarehouseName;
