import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { queueIds } from "redux/slices/productCache";
import { RootState } from "../../redux/store";
import { EMPTY_GUID, guid } from "../../types/guid";
import useAppDispatch from "../useAppDispatch";

/**
 * Do not use getProductById if you want to display a Product name or code by id.
 * Instead, use a dedicated component if available.
 *
 * Otherwise, make sure that getProductById is only called inside useEffect or event callbacks.
 */
const useProductCache = () => {
  const productCache: any = useSelector(
    (state: RootState) => state.productCache
  );
  const dispatch = useAppDispatch();

  const getProductById = useCallback(
    (id: guid) => {
      if (id === EMPTY_GUID) {
        return { name: "", itemCode: "", size: "" };
      }
      if (productCache.data[id]) {
        return productCache.data[id];
      } else {
        dispatch(queueIds([id]));
        return {
          name: CacheObjectStateMessage.LOADING,
          itemCode: CacheObjectStateMessage.LOADING,
          size: CacheObjectStateMessage.LOADING,
        };
      }
    },
    [productCache, dispatch]
  );

  return [getProductById];
};

export default useProductCache;
