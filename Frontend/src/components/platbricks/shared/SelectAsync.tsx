import { Chip, InputProps } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import useSelectAsync from "hooks/useSelectAsync";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ListBox } from "./ListBox";

export interface SelectAsyncOption {
  label: string;
  value: string;
  reason?: string;
}

interface SelectAsyncProps extends InputProps {
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>;
  onSelectionChange?: (selection: SelectAsyncOption | null) => void;
  onSelectionMultiChange?: (selection: SelectAsyncOption[]) => void;
  suggestionsIfEmpty?: boolean;
  initValue?: SelectAsyncOption;
  initMultipleValue?: SelectAsyncOption[];
  onBlur?: (args: any) => void;
  label?: string;
  name: string;
  placeholder?: string;
  multiple?: boolean;
  getOptionDisabled?: (option: SelectAsyncOption) => boolean;
  disableClearable?: boolean;
}

const SelectAsync = (props: SelectAsyncProps) => {
  const { t } = useTranslation();
  const initialized = useRef(false);
  const [selection, setSelection] = React.useState<SelectAsyncOption | null>(
    props.initValue || null
  );
  const [selectionMultiple, setSelectionMultiple] = React.useState<
    SelectAsyncOption[]
  >(props.initMultipleValue || []);

  const [inputValue, setInputValue] = React.useState(
    props.initValue?.label || ""
  );

  const [open, setOpen] = React.useState(false);

  const { options, loading, setSearchValue, nextPage } = useSelectAsync(
    props.asyncFunc,
    { loadSuggestionsIfEmpty: props.suggestionsIfEmpty }
  );

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
    if (props.multiple && props.initMultipleValue) {
      if (!props.initMultipleValue.some((r) => selectionMultiple.includes(r))) {
        setSelectionMultiple(props.initMultipleValue);
      }
    } else {
      if (
        props.initValue?.label !== selection?.label ||
        props.initValue?.value !== selection?.value
      ) {
        setSelection(
          props.initValue
            ? {
                label: props.initValue?.label || "",
                value: props.initValue?.value,
              }
            : null
        );
      }
    }
  }, [props.initValue, props.initMultipleValue]);
  /* eslint-enable */
  //
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (initialized.current) {
      if (!props.multiple)
        props.onSelectionChange && props.onSelectionChange(selection!);
      else
        props.onSelectionMultiChange &&
          props.onSelectionMultiChange(selectionMultiple);
    } else {
      initialized.current = true;
    }
  }, [selection, selectionMultiple]);

  useEffect(() => {
    setSearchValue(inputValue);
  }, [open, inputValue]);
  /* eslint-enable */

  const selectDropdown = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      name={props.name}
      error={props.error}
      label={props.label}
      disabled={props.disabled}
      placeholder={props.placeholder ?? undefined}
      onBlur={(e) => props.onBlur && props.onBlur(e)}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  );

  return (
    <Autocomplete
      disabled={props.disabled}
      ListboxProps={{
        onScroll: handleScroll,
      }}
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
      isOptionEqualToValue={isOptionEqualToValue}
      options={options}
      loading={loading}
      multiple={props.multiple ?? false}
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
      value={
        props.multiple
          ? selectionMultiple
            ? selectionMultiple
            : null
          : selection?.value
          ? selection
          : null
      }
      onChange={(
        event: any,
        newValue: any,
        reason: AutocompleteChangeReason
      ) => {
        if (props.multiple) {
          setSelectionMultiple(newValue);
        } else {
          setSelection((prevState) => ({
            ...prevState,
            label: newValue?.label ?? "",
            value: newValue?.value ?? "",
            reason: reason,
          }));
        }
      }}
      renderTags={(values, getTagProps) =>
        values.map((value, index) => {
          if (!Array.isArray(value) && value) {
            return (
              <Chip
                size="small"
                label={value.label}
                {...getTagProps({ index })}
                key={index}
              />
            );
          } else {
            return <></>;
          }
        })
      }
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={selectDropdown}
      getOptionDisabled={props.getOptionDisabled}
      disableClearable={props.disableClearable}
    />
  );
};

export default SelectAsync;
