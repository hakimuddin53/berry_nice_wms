import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { queueIds } from "redux/slices/warehouseCache";
import { RootState } from "../../redux/store";
import { EMPTY_GUID, guid } from "../../types/guid";
import useAppDispatch from "../useAppDispatch";

/**
 * Do not use getWarehouseById if you want to display a Warehouse name by id.
 * Instead use WarehouseName component.
 *
 * Otherwise make sure, that getWarehouseById is only called inside useEffect or event callbacks.
 */
const useWarehouseCache = () => {
  const warehouseCache: any = useSelector(
    (state: RootState) => state.warehouseCache
  );
  const dispatch = useAppDispatch();
  const getWarehouseById = useCallback(
    (id: guid) => {
      if (id === EMPTY_GUID) {
        return { name: "" };
      }
      if (warehouseCache.data[id]) {
        return warehouseCache.data[id];
      } else {
        dispatch(queueIds([id]));
        return { name: CacheObjectStateMessage.LOADING };
      }
    },
    [warehouseCache, dispatch]
  );
  return [getWarehouseById];
};
export default useWarehouseCache;
