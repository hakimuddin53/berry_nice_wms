import { Chip, InputProps } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import useSelectAsync2 from "hooks/useSelectAsync2";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_GUID } from "types/guid";
import { ListBox } from "./ListBox";

export interface SelectAsyncProps extends InputProps {
  ids?: string[];
  onBlur?: () => void;
  label?: string;
  name: string;
  placeholder?: string;
  getOptionDisabled?: (option: SelectAsyncOption) => boolean;
  disableClearable?: boolean;
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>;
  suggestionsIfEmpty?: boolean;
  helperText?: React.ReactNode;
}

interface SingleProps extends SelectAsyncProps {
  isMulti?: false;
  onSelectionChange?: (input?: SelectAsyncOption) => void;
}

interface MultiProps extends SelectAsyncProps {
  isMulti: true;
  onSelectionChange?: (input: SelectAsyncOption[]) => void;
}

export interface SelectAsyncOption {
  label: string;
  value: string;
}

const SelectAsync2 = (props: SingleProps | MultiProps) => {
  const { t } = useTranslation();
  const initialized = useRef(false);

  const [reason, setReason] = React.useState<string | null>();
  const [selection, setSelection] = React.useState<any>();
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const {
    options,
    loading,
    initialSelection,
    setSearchValue,
    performSearchByIds,
    nextPage,
  } = useSelectAsync2(props.asyncFunc, {
    loadSuggestionsIfEmpty: props.suggestionsIfEmpty,
  });

  const isOptionEqualToValue = (
    option: SelectAsyncOption | SelectAsyncOption[],
    value: SelectAsyncOption | SelectAsyncOption[]
  ) => {
    if (Array.isArray(value) && Array.isArray(option)) {
      return option.some((r) => value.includes(r));
    } else if (!Array.isArray(value) && !Array.isArray(option)) {
      return option.value === value.value;
    }
    return false;
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (initialized.current) {
      if (props.isMulti === true) {
        props.onSelectionChange && props.onSelectionChange(selection ?? []);
      } else {
        props.onSelectionChange && props.onSelectionChange(selection);
      }
    } else {
      initialized.current = true;
    }
  }, [selection]);

  useEffect(() => {
    setSearchValue(inputValue);
  }, [open, inputValue]);

  useEffect(() => {
    if (!reason) {
      if (props.ids && props.ids.length > 0 && props.ids[0] !== EMPTY_GUID) {
        performSearchByIds(props.ids);
      } else {
        performSearchByIds([]);
      }
    }
  }, [props.ids, reason]);
  /* eslint-enable */

  const selectDropdown = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      name={props.name}
      error={props.error}
      helperText={props.helperText}
      label={props.label}
      disabled={props.disabled}
      placeholder={props.placeholder ?? undefined}
      InputProps={{
        ...params.InputProps,
        readOnly: props.readOnly,
        endAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  );

  const getValue = () => {
    if (selection) {
      return props.isMulti
        ? selection
          ? selection
          : []
        : selection?.value
        ? selection
        : null;
    } else if (!reason) {
      return props.isMulti
        ? initialSelection
          ? initialSelection
          : []
        : initialSelection.length > 0 && initialSelection[0]?.value
        ? initialSelection[0]
        : null;
    }
    return props.isMulti ? [] : null;
  };

  const handleScroll = async (event: any) => {
    if (loading) {
      return;
    }
    const listboxNode = event.currentTarget;

    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      nextPage();
    }
  };

  return (
    <Autocomplete
      disabled={props.disabled}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      onBlur={() => props.onBlur && props.onBlur()}
      ListboxComponent={ListBox}
      id="asynchronous-demo"
      fullWidth
      readOnly={props.readOnly}
      open={open}
      filterOptions={(o) => o}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) =>
        Array.isArray(option) ? "" : option?.label ?? ""
      }
      isOptionEqualToValue={isOptionEqualToValue}
      options={options}
      loading={loading}
      multiple={props.isMulti ?? false}
      noOptionsText={
        inputValue === "" && !props.suggestionsIfEmpty
          ? t("common:tap-to-search")
          : t("common:no-result")
      }
      renderOption={(props, option) => {
        if (!Array.isArray(option)) {
          return (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          );
        }
      }}
      autoComplete
      includeInputInList
      autoHighlight
      filterSelectedOptions={false}
      size="small"
      value={getValue()}
      onChange={(
        event: any,
        newValue: any,
        reason: AutocompleteChangeReason
      ) => {
        setReason(reason);
        setSelection(newValue);
      }}
      renderTags={(values, getTagProps) =>
        values.map((value, index) => {
          if (!Array.isArray(value) && value) {
            return (
              <Chip
                size="small"
                label={value.label}
                {...getTagProps({ index })}
              />
            );
          } else {
            return <></>;
          }
        })
      }
      onInputChange={(event, newInputValue, reason) => {
        if (props.readOnly) {
          return;
        }
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      renderInput={selectDropdown}
      getOptionDisabled={props.getOptionDisabled}
      disableClearable={props.disableClearable}
    />
  );
};

export default SelectAsync2;
