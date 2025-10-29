import React, { useEffect } from "react";
import { SelectAsyncOption } from "../components/platbricks/shared/SelectAsync";
import useDebounce from "./useDebounce";

const useSelectAsync2 = (
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>,
  settings?: {
    loadSuggestionsIfEmpty?: boolean;
    pageSize?: number;
  }
) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly SelectAsyncOption[]>(
    []
  );
  const [initialSelection, setInitialSelection] = React.useState<
    SelectAsyncOption[]
  >([]);

  const [loading, setLoading] = React.useState(false);
  const [optionsIfEmpty, setOptionsIfEmpty] =
    React.useState<SelectAsyncOption[]>();

  const loadSuggestionsIfEmpty =
    settings && settings.loadSuggestionsIfEmpty !== undefined
      ? settings.loadSuggestionsIfEmpty
      : false;
  const pageSize =
    settings && settings.pageSize !== undefined ? settings.pageSize : 10;

  /* eslint-disable react-hooks/exhaustive-deps */
  var _performNewSearch = React.useCallback(
    async (label: string, ids?: string[]) => {
      setOptions([]);
      setLoading(true);
      setInitialSelection([]);
      let newOptions = await asyncFunc(label, 1, pageSize, ids);
      if (newOptions) {
        setOptions([...newOptions]);
        if (
          loadSuggestionsIfEmpty &&
          label === "" &&
          (!ids || ids.length === 0)
        ) {
          setOptionsIfEmpty([...newOptions]);
        }
      }
      if (ids && ids.length > 0) {
        setInitialSelection([...newOptions]);
      }
      setLoading(false);
    },
    [asyncFunc]
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

  const performSearchByIds = (ids: string[]) => {
    if (ids && ids.length > 0) {
      (async () => {
        await performNewSearch("", ids);
      })();
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (searchValue === "") {
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
    initialSelection,
    setSearchValue,
    performSearchByIds,
    nextPage,
    setOptionsIfEmpty,
  };
};

export default useSelectAsync2;
