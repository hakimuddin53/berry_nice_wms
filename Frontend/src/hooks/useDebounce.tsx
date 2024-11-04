import { debounce } from "lodash";
import { useCallback } from "react";

/* eslint-disable react-hooks/exhaustive-deps */
function useDebounce(callback: any, delay: number) {
  const debounceFunc = useCallback(
    debounce((...args: any) => callback(...args), delay),
    [callback, delay]
  );
  return debounceFunc;
}
/* eslint-enable */

export default useDebounce;
