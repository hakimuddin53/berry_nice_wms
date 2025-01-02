import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { queueIds } from "redux/slices/userCache";
import { RootState } from "../../redux/store";
import { EMPTY_GUID, guid } from "../../types/guid";
import useAppDispatch from "../useAppDispatch";

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
