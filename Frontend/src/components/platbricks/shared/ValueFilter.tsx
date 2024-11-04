import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { stringToDateTime } from "utils/helper";
import SelectAsync, { SelectAsyncOption } from "./SelectAsync";

export const DataType = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  DATE: "DATE",
  TIME: "TIME",
  ENUM: "ENUM",
  GUID: "GUID",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type DataType = typeof DataType[keyof typeof DataType];
/* eslint-enable */
export const SearchType = {
  EQUALS: "EQUALS",
  CONTAINS: "CONTAINS",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  BETWEEN: "BETWEEN",
  STARTS_WITH: "STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  STRING_GREATER_THAN_OR_EQUALS: "STRING_GREATER_THAN_OR_EQUALS",
  STRING_LESS_THAN_OR_EQUALS: "STRING_LESS_THAN_OR_EQUALS",
  IN: "IN",
} as const;
/* eslint-disable @typescript-eslint/no-redeclare */
export type SearchType = typeof SearchType[keyof typeof SearchType];
/* eslint-enable */
export interface SearchObject {
  searchType: string;
  searchValue: string;
  searchEndValue: string;
  searchMultipleValue: SelectOption[];
}

export interface FilterChangeParam {
  filterType: any;
  filterEndType: any;
  value: string;
  endValue: string;
  valueMultiple: SelectOption[];
}

export type SearchTypes = {
  [key: string]: {
    type: string[];
  };
};

export const SearchTypeOptions: SearchTypes = {
  STRING: {
    type: [
      SearchType.IN,
      SearchType.CONTAINS,
      SearchType.BETWEEN,
      SearchType.STARTS_WITH,
      SearchType.ENDS_WITH,
      SearchType.STRING_GREATER_THAN_OR_EQUALS,
      SearchType.STRING_LESS_THAN_OR_EQUALS,
    ],
  },
  NUMBER: {
    type: [
      SearchType.IN,
      SearchType.GREATER_THAN,
      SearchType.LESS_THAN,
      SearchType.BETWEEN,
    ],
  },
  DATE: {
    type: [
      SearchType.EQUALS,
      SearchType.GREATER_THAN,
      SearchType.LESS_THAN,
      SearchType.BETWEEN,
    ],
  },
  DATETIME: {
    type: [
      SearchType.EQUALS,
      SearchType.GREATER_THAN,
      SearchType.LESS_THAN,
      SearchType.BETWEEN,
    ],
  },
  TIME: {
    type: [
      SearchType.EQUALS,
      SearchType.GREATER_THAN,
      SearchType.LESS_THAN,
      SearchType.BETWEEN,
    ],
  },
  ENUM: {
    type: [SearchType.IN],
  },
  GUID: {
    type: [SearchType.IN],
  },
};

export interface SelectOption {
  label: string;
  value: string;
}

type ValueFilterProps = {
  placeholder: string;
  dataType: DataType;
  onFilterChange?: (value: FilterChangeParam) => void;
  inValues?: SelectOption[];
  inValuesAsync?: (
    input: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>;
  searchTypeValue?: any;
  searchValue?: any;
  searchEndValue?: any;
  searchMultipleValue?: SelectOption[];
  initialValue?: SelectAsyncOption[];
  filterComponent?: JSX.Element;
};

const ValueFilter = (props: ValueFilterProps) => {
  const {
    placeholder,
    dataType,
    onFilterChange,
    inValues,
    inValuesAsync,
    searchTypeValue,
    searchValue,
    searchEndValue,
    searchMultipleValue,
    initialValue,
    filterComponent,
  } = props;

  const { t } = useTranslation();
  var [selection, setSelection] = useState<SearchObject>({
    searchType:
      (searchTypeValue ?? "") !== "" ? searchTypeValue : SearchType.IN,
    searchValue: (searchValue ?? "") !== "" ? searchValue : "",
    searchEndValue:
      (searchTypeValue ?? "") !== "" && searchTypeValue === SearchType.BETWEEN
        ? searchEndValue ?? ""
        : "",
    searchMultipleValue: searchMultipleValue ?? [],
  });

  const getSearchTypeNumber = (type: string) => {
    if (type === SearchType.GREATER_THAN) return 10;
    else if (type === SearchType.LESS_THAN) return 12;
    else return 0;
  };

  const setSearchValue = (
    type: string,
    value: string,
    multipleValue?: SelectOption[],
    searchClassification?: "start" | "end"
  ) => {
    let searchValue = "";
    let searchEndValue = "";

    if (type === SearchType.BETWEEN) {
      searchValue =
        !searchClassification ||
        (searchClassification && searchClassification === "start")
          ? value
          : selection.searchValue;

      searchEndValue =
        searchClassification && searchClassification === "end"
          ? value
          : selection.searchEndValue;
    } else {
      searchValue = value;
      searchEndValue = "";
    }

    const filterChangeParam: FilterChangeParam = {
      filterType:
        type === SearchType.BETWEEN
          ? getSearchTypeNumber(SearchType.GREATER_THAN)
          : getSearchTypeNumber(type),
      filterEndType:
        searchClassification && searchClassification === "end"
          ? getSearchTypeNumber(SearchType.LESS_THAN)
          : undefined,
      value: searchValue,
      endValue: searchEndValue,
      valueMultiple: multipleValue ?? [],
    };

    if (dataType === DataType.STRING) {
      filterChangeParam.filterType =
        type === SearchType.BETWEEN
          ? SearchType.STRING_GREATER_THAN_OR_EQUALS
          : type;
      filterChangeParam.filterEndType =
        searchClassification && searchClassification === "end"
          ? SearchType.STRING_LESS_THAN_OR_EQUALS
          : undefined;
    }
    onFilterChange && onFilterChange(filterChangeParam);

    setSelection({
      searchType: type,
      searchValue: searchValue,
      searchEndValue: searchEndValue,
      searchMultipleValue: multipleValue ?? [],
    });
  };

  const getEqualAndInSearchTypeComponent = () => {
    if (inValuesAsync) {
      return (
        <FormControl fullWidth error={false}>
          <SelectAsync
            id="searchSelectAsyncField"
            name="searchSelectAsyncField"
            error={false}
            multiple={true}
            onSelectionMultiChange={(newOption) => {
              if (!newOption) return;
              setSearchValue(
                selection.searchType,
                "",
                newOption.map((x) => {
                  return {
                    label: x.label,
                    value: x.value,
                  };
                })
              );
            }}
            asyncFunc={inValuesAsync}
            initMultipleValue={initialValue ? initialValue : undefined}
          />
        </FormControl>
      );
    } else if (inValues) {
      return (
        <FormControl fullWidth sx={{ minWidth: 220 }}>
          <Autocomplete
            id="transition-list"
            options={inValues}
            multiple
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={selection.searchMultipleValue}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.label}
              </Box>
            )}
            onChange={(e, value) => {
              setSearchValue(selection.searchType, "", value);
            }}
          />
        </FormControl>
      );
    } else if (filterComponent) {
      return filterComponent;
    } else {
      return getSearchField();
    }
  };

  const getValue = (searchClassification?: string) => {
    return searchClassification && searchClassification === "end"
      ? selection.searchEndValue
        ? selection.searchEndValue
        : null
      : selection.searchValue
      ? selection.searchValue
      : null;
  };

  const getSearchField = (searchClassification?: "start" | "end") => {
    switch (dataType) {
      case DataType.STRING:
        return (
          <TextField
            fullWidth
            id={"searchStringField" + searchClassification}
            name={"searchStringField" + searchClassification}
            size="small"
            value={getValue(searchClassification) ?? ""}
            onChange={(e) => {
              setSearchValue(
                selection.searchType,
                e.target.value as string,
                [],
                searchClassification
              );
            }}
            placeholder={`${placeholder} ${t(searchClassification ?? "")}`}
          />
        );
      case DataType.NUMBER:
        return (
          <TextField
            fullWidth
            id={"searchNumberField" + searchClassification}
            name={"searchNumberField" + searchClassification}
            size="small"
            value={getValue(searchClassification)}
            onChange={(e) => {
              setSearchValue(
                selection.searchType,
                e.target.value as string,
                [],
                searchClassification
              );
            }}
            placeholder={`${placeholder} ${t(searchClassification ?? "")}`}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
        );
      case DataType.DATE:
        return (
          <DatePicker
            value={stringToDateTime(getValue(searchClassification))}
            onChange={(value) => {
              setSearchValue(
                selection.searchType,
                value?.toString() ?? "",
                [],
                searchClassification
              );
            }}
            slotProps={{ textField: { variant: "outlined", size: "small" } }}
          />
        );
      case DataType.TIME:
        return (
          <TimePicker
            value={stringToDateTime(getValue(searchClassification))}
            onChange={(value) => {
              setSearchValue(
                selection.searchType,
                value?.toString() ?? "",
                [],
                searchClassification
              );
            }}
            slotProps={{ textField: { variant: "outlined", size: "small" } }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            id={"searchStringField" + searchClassification}
            name={"searchStringField" + searchClassification}
            size="small"
            value={getValue(searchClassification)}
            onChange={(e) => {
              setSearchValue(
                selection.searchType,
                e.target.value as string,
                [],
                searchClassification
              );
            }}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <Select
            size="small"
            value={selection.searchType}
            onChange={(e) => {
              setSearchValue(e.target.value, "");
            }}
          >
            {Object.values(SearchTypeOptions[dataType].type).map((v, index) => (
              <MenuItem key={index} value={v}>
                {t(v)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={9}>
        {[
          "CONTAINS",
          "GREATER_THAN",
          "LESS_THAN",
          "STARTS_WITH",
          "ENDS_WITH",
          "STRING_GREATER_THAN_OR_EQUALS",
          "STRING_LESS_THAN_OR_EQUALS",
        ].includes(selection.searchType) && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {getSearchField()}
            </Grid>
          </Grid>
        )}

        {(selection.searchType === SearchType.EQUALS ||
          selection.searchType === SearchType.IN) && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {getEqualAndInSearchTypeComponent()}
            </Grid>
          </Grid>
        )}
        {selection.searchType === SearchType.BETWEEN && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {getSearchField("start")}
            </Grid>
            <Grid item xs={12} md={6}>
              {getSearchField("end")}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export const convertInTypeSearchToEqual = (filterType: any): any => {
  if (filterType === SearchType.IN) {
    return SearchType.EQUALS;
  }
  return filterType;
};

export const assignFilter = (filter: FilterChangeParam, type: string): any => {
  let { filterType, filterEndType, value, endValue, valueMultiple } = filter;

  filterType = convertInTypeSearchToEqual(filterType);

  switch (type) {
    case DataType.STRING:
      return [
        value
          ? {
              values: [value],
              filterType: convertInTypeSearchToEqual(filterType),
            }
          : { values: [] },
        endValue
          ? { values: [endValue], filterType: filterEndType }
          : { values: [] },
        valueMultiple && valueMultiple.length > 0
          ? {
              values: valueMultiple.map((x) => x.label),
              filterType: convertInTypeSearchToEqual(filterType),
            }
          : { values: [] },
      ];

    case DataType.ENUM:
      return valueMultiple && valueMultiple.length > 0
        ? [
            {
              values: valueMultiple.map((x) => x.value as any),
              filterType: filterType,
            },
          ]
        : undefined;

    case DataType.GUID:
      return valueMultiple && valueMultiple.length > 0
        ? [
            {
              values: valueMultiple.map((x) => x.value as any),
              filterType: filterType,
            },
          ]
        : undefined;
  }
};

export default ValueFilter;
