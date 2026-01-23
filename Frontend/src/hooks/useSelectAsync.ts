import React, { useEffect } from "react";
import { SelectAsyncOption } from "../components/platbricks/shared/SelectAsync";
import useDebounce from "./useDebounce";

const useSelectAsync = (
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>,
  settings?: {
    loadSuggestionsIfEmpty?: boolean;
    pageSize?: number;
    strictSearch?: boolean;
  }
) => {
  const previousSearchValue = React.useRef("");
  const optionsRef = React.useRef<readonly SelectAsyncOption[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [options, _setOptions] = React.useState<readonly SelectAsyncOption[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [optionsIfEmpty, setOptionsIfEmpty] = React.useState<
    SelectAsyncOption[] | undefined
  >();

  //if strictSearch = true, useSelectAsync will not perform a search if the previous search did not find any result
  //and the new search value is just an extension of the previous search value
  const strictSearch = settings?.strictSearch ?? false;

  const loadSuggestionsIfEmpty =
    settings && settings.loadSuggestionsIfEmpty !== undefined
      ? settings.loadSuggestionsIfEmpty
      : false;
  const pageSize =
    settings && settings.pageSize !== undefined ? settings.pageSize : 10;

  const setOptions = React.useCallback((newValue: SelectAsyncOption[]) => {
    _setOptions(newValue);
    optionsRef.current = newValue;
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  var _performNewSearch = React.useCallback(
    async (label: string) => {
      if (
        strictSearch &&
        previousSearchValue.current !== "" &&
        label.startsWith(previousSearchValue.current) &&
        optionsRef.current.length === 0
      ) {
        previousSearchValue.current = label;
        return;
      }
      previousSearchValue.current = label;
      setOptions([]);
      setLoading(true);
      let newOptions = await asyncFunc(label, 1, pageSize);
      if (newOptions) {
        setOptions([...newOptions]);
        if (loadSuggestionsIfEmpty && label === "") {
          setOptionsIfEmpty([...newOptions]);
        }
      }
      setLoading(false);
    },
    [asyncFunc, strictSearch, loadSuggestionsIfEmpty, pageSize]
  );
  /* eslint-enable */

  var performNewSearch = useDebounce(_performNewSearch, 200);

  const nextPage = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let nextPage = 1 + Math.floor((options.length + pageSize - 1) / pageSize);
    let newOptions = await asyncFunc(searchValue, nextPage, pageSize);
    if (newOptions) {
      setOptions([...options, ...newOptions]);
    }
    setLoading(false);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (searchValue === "") {
      previousSearchValue.current = "";
      if (optionsIfEmpty && optionsIfEmpty.length > 0) {
        setOptions(optionsIfEmpty);
        return undefined;
      }
      if (!loadSuggestionsIfEmpty) {
        setOptions([]);
        return undefined;
      }
    }
    (async () => {
      await performNewSearch(searchValue);
    })();
  }, [searchValue, loadSuggestionsIfEmpty, optionsIfEmpty]);
  /* eslint-enable */

  return {
    options,
    loading,
    setSearchValue,
    nextPage,
    setOptionsIfEmpty,
  };
};

export default useSelectAsync;
