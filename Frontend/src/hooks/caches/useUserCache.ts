import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { queueIds } from "redux/slices/userCache";
import { RootState } from "../../redux/store";
import { EMPTY_GUID, guid } from "../../types/guid";
import useAppDispatch from "../useAppDispatch";

const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const isGuidString = (value?: any) =>
  typeof value === "string" && GUID_REGEX.test(value);

/**
 * Do not use getUserById if you want to display a User name by id. Instead use UserName component.
 *
 * Otherwise make sure, that getUserById is only called inside useEffect or event callbacks.
 */
const useUserCache = () => {
  const userCache: any = useSelector((state: RootState) => state.userCache);
  const dispatch = useAppDispatch();
  const getUserById = useCallback(
    (id: guid) => {
      if (id === EMPTY_GUID) {
        return { userName: "" };
      }
      if (!isGuidString(id)) {
        // If the id is not a GUID, use the raw value instead of querying the cache/API
        return { userName: String(id) };
      }
      if (userCache.data[id]) {
        return userCache.data[id];
      } else {
        dispatch(queueIds([id]));
        return { userName: CacheObjectStateMessage.LOADING };
      }
    },
    [userCache, dispatch]
  );
  return [getUserById];
};
export default useUserCache;
