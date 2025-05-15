import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { queueIds } from "redux/slices/locationCache";
import { RootState } from "../../redux/store";
import { EMPTY_GUID, guid } from "../../types/guid";
import useAppDispatch from "../useAppDispatch";

/**
 * Do not use getLocationById if you want to display a Location name by id.
 * Instead, use LocationName component.
 *
 * Otherwise make sure, that getLocationById is only called inside useEffect or event callbacks.
 */
const useLocationCache = () => {
  const locationCache: any = useSelector(
    (state: RootState) => state.locationCache
  );
  const dispatch = useAppDispatch();
  const getLocationById = useCallback(
    (id: guid) => {
      if (id === EMPTY_GUID) {
        return { name: "" };
      }
      if (locationCache.data[id]) {
        return locationCache.data[id];
      } else {
        dispatch(queueIds([id]));
        return { name: CacheObjectStateMessage.LOADING };
      }
    },
    [locationCache, dispatch]
  );
  return [getLocationById];
};
export default useLocationCache;
