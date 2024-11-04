import { Add, Clear, FilterAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  FilterOptionsState,
  IconButton,
  MenuItem,
  Popper,
  SvgIconProps,
  TextField,
  autocompleteClasses,
  createFilterOptions,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import useSelectAsync from "hooks/useSelectAsync";
import { useUserDateTime } from "hooks/useUserDateTime";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";
import { stringToDateTime } from "utils/helper";
import PbMenu from "./PbMenu";
import { SelectAsyncOption } from "./SelectAsync";

interface TableFilterOption {
  value: string;
  label: string;
  color?: string;
}
interface ITableFilter {
  key: string;
  label: string;
}
interface TableFilterMultiselect extends ITableFilter {
  type: "multiselect";
  options: TableFilterOption[];
}
interface TableFilterMultiselectAsync extends ITableFilter {
  type: "multiselect-async";
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>;
}
interface TableFilterOthers extends ITableFilter {
  type: "daterange" | "user" | "location" | "string" | "int";
}
export type TableFilter =
  | TableFilterMultiselect
  | TableFilterMultiselectAsync
  | TableFilterOthers;

export type TableFilterValueDate = {
  dateMin?: string | null;
  dateMax?: string | null;
};
type TableFilterValueType = string | string[] | TableFilterValueDate;
export interface TableFilterValue {
  key: string;
  value: TableFilterValueType;
}

const AddFilterIcon = (props: SvgIconProps) => {
  return (
    <>
      <FilterAlt {...props} />
      <Add
        {...props}
        style={{ marginLeft: "-4px", marginTop: "4px", fontSize: 13 }}
      />
    </>
  );
};

interface TableFiltersProps {
  filters: TableFilter[];
  onFilterValueChanged?: (newValue: TableFilterValue[]) => void;
}
const TableFilters = (props: TableFiltersProps) => {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState<TableFilterValue[]>([]);
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAddingFilter, setIsAddingFilter] = useState(false);

  const selectFilterToAdd = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onFilterSelectClose = () => {
    setAnchorEl(null);
  };

  const addFilter = (filter: TableFilter) => {
    setActiveFilters((currentValue) => [...currentValue, filter]);
    setIsAddingFilter(true);
    setAnchorEl(null);
  };

  const onFilterCloseWhileEmpty = (key: string) => {
    setActiveFilters(activeFilters.filter((v) => v.key !== key));
    setIsAddingFilter(false);
  };

  const filterValueChangeHandler = (
    value: TableFilterOption[] | TableFilterValueDate | string,
    key: string
  ) => {
    const newValues = filterValues.filter((v) => v.key !== key);
    if (
      value &&
      ((Array.isArray(value) && value.length > 0) ||
        (isTableFilterValueDate(value) && (value.dateMax || value.dateMin)))
    ) {
      newValues.push({
        key,
        value: Array.isArray(value) ? value.map((v) => v.value) : value,
      });
    } else if (typeof value === "string" && value !== "") {
      newValues.push({
        key,
        value: Array.isArray(value) ? value.map((v) => v.value) : value,
      });
    } else {
      setActiveFilters(activeFilters.filter((v) => v.key !== key));
    }
    setFilterValues(newValues);
    setIsAddingFilter(false);
    if (props.onFilterValueChanged) {
      props.onFilterValueChanged(newValues);
    }
  };

  const inactiveFilters = props.filters.filter(
    (f) => activeFilters.findIndex((af) => af.key === f.key) < 0
  );

  useEffect(() => {
    setActiveFilters((currentActiveFilters) =>
      props.filters.filter(
        (f) => currentActiveFilters.findIndex((f2) => f2.key === f.key) >= 0
      )
    );
  }, [props.filters]);

  return (
    <div style={{ padding: "10px 0px" }}>
      <span style={{ fontWeight: "bold" }}>{t("common:filter-by")}:</span>
      {activeFilters.map((filter) => {
        switch (filter.type) {
          case "multiselect":
            return (
              <TableMultiselectFilter
                {...filter}
                onValueChange={(value) =>
                  filterValueChangeHandler(value, filter.key)
                }
                onCloseWhileEmpty={() => onFilterCloseWhileEmpty(filter.key)}
              />
            );
          case "multiselect-async":
            return (
              <TableMultiselectAsyncFilter
                {...filter}
                onValueChange={(value) =>
                  filterValueChangeHandler(value, filter.key)
                }
                onCloseWhileEmpty={() => onFilterCloseWhileEmpty(filter.key)}
              />
            );
          case "daterange":
            return (
              <TableDateFilter
                {...filter}
                onValueChange={(value) =>
                  filterValueChangeHandler(value, filter.key)
                }
                onCloseWhileEmpty={() => onFilterCloseWhileEmpty(filter.key)}
              />
            );

          case "string":
            return (
              <TableStringFilter
                {...filter}
                onValueChange={(value) =>
                  filterValueChangeHandler(value, filter.key)
                }
                onCloseWhileEmpty={() => onFilterCloseWhileEmpty(filter.key)}
                type="text"
              />
            );
          case "int":
            return (
              <TableStringFilter
                {...filter}
                onValueChange={(value) =>
                  filterValueChangeHandler(value, filter.key)
                }
                onCloseWhileEmpty={() => onFilterCloseWhileEmpty(filter.key)}
                type="number"
              />
            );

          default:
            return <></>;
        }
      })}
      {inactiveFilters.length > 0 && !isAddingFilter ? (
        <Chip
          icon={<AddFilterIcon />}
          sx={{ m: "2px 3px", lineHeight: "normal" }}
          size="small"
          color={"default"}
          label={t("common:add-filter")}
          onClick={selectFilterToAdd}
        />
      ) : (
        ""
      )}
      <PbMenu
        popVariant="popper"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onFilterSelectClose}
      >
        {inactiveFilters.map((filter) => (
          <MenuItem key={filter.key} onClick={() => addFilter(filter)}>
            {filter.label}
          </MenuItem>
        ))}
      </PbMenu>
    </div>
  );
};

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}
const StyledAutocompletePopper = styled("div")(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: "none",
    margin: 0,
    color: "inherit",
    fontSize: 13,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: "auto",
      alignItems: "flex-start",
      padding: 8,
      borderBottom: `1px solid  ${
        theme.palette.mode === "light" ? " #eaecef" : "#30363d"
      }`,
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: "relative",
  },
}));

function PopperComponent(props: PopperComponentProps) {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === "light" ? "#e1e4e8" : "#30363d"}`,
  boxShadow: `0 8px 24px ${
    theme.palette.mode === "light" ? "rgba(149, 157, 165, 0.2)" : "rgb(1, 4, 9)"
  }`,
  borderRadius: 6,
  width: 300,
  zIndex: theme.zIndex.appBar - 1,
  fontSize: 13,
  color: theme.palette.mode === "light" ? "#24292e" : "#c9d1d9",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#1c2128",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  padding: 10,
  width: "100%",
  borderBottom: `1px solid ${
    theme.palette.mode === "light" ? "#eaecef" : "#30363d"
  }`,
}));

export const isTableFilterValueDate = (
  object: any
): object is TableFilterValueDate => {
  return typeof object === "object" && "dateMin" in object;
};

interface TableFilterProps {
  children: React.ReactNode;
  label: string;
  value: TableFilterValueType | TableFilterOption[];
  onOpen?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
  closeOnClear?: boolean;
}

/* eslint-disable @typescript-eslint/no-redeclare */
const TableFilter = (props: TableFilterProps) => {
  const { t } = useTranslation();
  const { getLocalDateAndTime } = useUserDateTime();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = React.useRef(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (props.onOpen) props.onOpen();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (props.onClose) props.onClose();
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const clearClickHandler = () => {
    if (props.closeOnClear === true) setAnchorEl(null);
    if (props.onClear) {
      props.onClear();
    }
  };

  const deleteClickHandler = () => {
    setAnchorEl(null);
    if (props.onDelete) {
      props.onDelete();
    }
  };

  const open = Boolean(anchorEl);

  var selectedValuesLabel = "all";
  if (Array.isArray(props.value)) {
    if (props.value.length > 0) {
      selectedValuesLabel = props.value
        .slice(0, 2)
        .map((v) => (typeof v === "string" ? v : v.label ?? v.value))
        .join(", ");
      if (props.value.length > 2) {
        selectedValuesLabel += ", +" + (props.value.length - 2);
      }
    }
  } else if (isTableFilterValueDate(props.value)) {
    if (props.value.dateMin && props.value.dateMax) {
      selectedValuesLabel =
        getLocalDateAndTime(props.value.dateMin) +
        " - " +
        getLocalDateAndTime(props.value.dateMax);
    } else if (props.value.dateMin) {
      selectedValuesLabel = "> " + getLocalDateAndTime(props.value.dateMin);
    } else if (props.value.dateMax) {
      selectedValuesLabel = "< " + getLocalDateAndTime(props.value.dateMax);
    }
  } else if (typeof props.value === "string") {
    if (props.value) {
      selectedValuesLabel = props.value;
    }
  } else {
    selectedValuesLabel = props.value;
  }

  useEffect(() => {
    //When the filters gets added first, open the filter dialog initially
    if (selectedValuesLabel === "all") {
      setAnchorEl(ref.current);
    }
  }, [selectedValuesLabel]);

  return (
    <React.Fragment>
      <Chip
        ref={ref}
        sx={{ m: "2px 3px" }}
        size="small"
        color={selectedValuesLabel === "all" ? "default" : "primary"}
        label={`${props.label}: ${selectedValuesLabel}`}
        onClick={handleClick}
        onDelete={
          selectedValuesLabel !== "all" ? deleteClickHandler : undefined
        }
      />
      <StyledPopper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Box
              display="flex"
              sx={{
                borderBottom: `1px solid ${
                  theme.palette.mode === "light" ? "#eaecef" : "#30363d"
                }`,
              }}
            >
              <Box
                flexGrow={1}
                sx={{
                  padding: "8px 10px",
                  fontWeight: 600,
                  overflowWrap: "anywhere",
                }}
              >
                {t("common:filter-by")}: {props.label}
              </Box>
              {props.onClear && (
                <Button onClick={clearClickHandler}>{t("common:clear")}</Button>
              )}
            </Box>
            {props.children}
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </React.Fragment>
  );
};
/* eslint-enable */
interface TableMultiselectFilterProps {
  label: string;
  options: TableFilterOption[];
  onValueChange?: (value: TableFilterOption[]) => void;
  onCloseWhileEmpty?: () => void;
}
const TableMultiselectFilter = (props: TableMultiselectFilterProps) => {
  const { t } = useTranslation();
  const [value, _setValue] = useState<TableFilterOption[]>([]);
  const [pendingValue, setPendingValue] = useState<TableFilterOption[]>([]);
  const theme = useTheme();

  const setValue = (value: TableFilterOption[]) => {
    _setValue(value);
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  const defaultFilterOptions = useMemo(
    () => createFilterOptions<TableFilterOption>(),
    []
  );
  const filterOptions = useCallback(
    (
      options: TableFilterOption[],
      state: FilterOptionsState<TableFilterOption>
    ) => {
      if (state.inputValue) {
        return defaultFilterOptions(options, state);
      } else {
        return options.filter((o) =>
          pendingValue.find((pv) => pv.value === o.value)
        );
      }
    },
    [pendingValue, defaultFilterOptions]
  );

  useEffect(() => {
    _setValue((currentValue) =>
      props.options.filter(
        (f) => currentValue.findIndex((f2) => f2.value === f.value) >= 0
      )
    );
  }, [props.options]);

  if (!props.options) {
    return <></>;
  }

  return (
    <TableFilter
      label={props.label}
      value={value}
      onOpen={() => setPendingValue(value)}
      onClose={() => {
        if (
          pendingValue.map((x) => x.value).join() !==
          value.map((x) => x.value).join()
        ) {
          setValue(pendingValue);
        } else if (value.length === 0 && props.onCloseWhileEmpty) {
          props.onCloseWhileEmpty();
        }
      }}
      onClear={pendingValue.length > 0 ? () => setPendingValue([]) : undefined}
      onDelete={() => setValue([])}
    >
      <Autocomplete
        open
        multiple
        value={pendingValue}
        onChange={(event, newValue, reason) => {
          if (
            event.type === "keydown" &&
            (event as React.KeyboardEvent).key === "Backspace" &&
            reason === "removeOption"
          ) {
            return;
          }
          setPendingValue(newValue);
        }}
        isOptionEqualToValue={(
          option: TableFilterOption,
          value: TableFilterOption
        ) => option.value === value.value}
        disableCloseOnSelect
        PopperComponent={PopperComponent}
        renderTags={() => null}
        noOptionsText={t("common:no-filter")}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            {option.color && (
              <Box
                component="span"
                sx={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  borderRadius: "3px",
                  mr: 1,
                  mt: "2px",
                }}
                style={{ backgroundColor: option.color }}
              />
            )}
            <Box
              sx={{
                flexGrow: 1,
                "& span": {
                  color: theme.palette.mode === "light" ? "#586069" : "#8b949e",
                },
              }}
            >
              {option.label}
            </Box>
            <Box
              component={CloseIcon}
              sx={{ opacity: 0.6, width: 18, height: 18 }}
              style={{
                visibility: selected ? "visible" : "hidden",
              }}
            />
          </li>
        )}
        options={props.options}
        getOptionLabel={(option) => option.label ?? option.value}
        renderInput={(params) => (
          <StyledTextField
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus
            placeholder={t("common:filter")}
            variant="outlined"
            size="small"
          />
        )}
        filterOptions={filterOptions}
      />
    </TableFilter>
  );
};

interface TableMultiselectAsyncFilterProps {
  label: string;
  asyncFunc: (
    value: string,
    page: number,
    pageSize: number
  ) => Promise<SelectAsyncOption[]>;
  onValueChange?: (value: TableFilterOption[]) => void;
  onCloseWhileEmpty?: () => void;
}
const TableMultiselectAsyncFilter = (
  props: TableMultiselectAsyncFilterProps
) => {
  const { t } = useTranslation();
  const [value, _setValue] = useState<TableFilterOption[]>([]);
  const [pendingValue, _setPendingValue] = useState<TableFilterOption[]>([]);
  const theme = useTheme();

  const setPendingValue = (newValue: TableFilterOption[]) => {
    _setPendingValue(newValue);
    setOptionsIfEmpty(
      newValue.map((x) => {
        return { label: x.label ?? x.value, value: x.value };
      })
    );
  };

  const setValue = (value: TableFilterOption[]) => {
    _setValue(value);
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  const { options, loading, setSearchValue, setOptionsIfEmpty } =
    useSelectAsync(props.asyncFunc);

  return (
    <TableFilter
      label={props.label}
      value={value}
      onOpen={() => setPendingValue(value)}
      onClose={() => {
        //Only set value, if selection has changed
        if (
          pendingValue.map((x) => x.value).join() !==
          value.map((x) => x.value).join()
        ) {
          setValue(pendingValue);
        } else if (value.length === 0 && props.onCloseWhileEmpty) {
          props.onCloseWhileEmpty();
        }
      }}
      onClear={
        pendingValue.length > 0
          ? () => {
              setPendingValue([]);
            }
          : undefined
      }
      onDelete={() => setValue([])}
    >
      <Autocomplete
        open
        multiple
        value={pendingValue}
        onChange={(event, newValue, reason) => {
          if (
            event.type === "keydown" &&
            (event as React.KeyboardEvent).key === "Backspace" &&
            reason === "removeOption"
          ) {
            return;
          }
          setPendingValue(newValue);
        }}
        disableCloseOnSelect
        PopperComponent={PopperComponent}
        renderTags={() => null}
        noOptionsText={t("common:no-filter")}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            {option.color && (
              <Box
                component="span"
                sx={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  borderRadius: "3px",
                  mr: 1,
                  mt: "2px",
                }}
                style={{ backgroundColor: option.color }}
              />
            )}
            <Box
              sx={{
                flexGrow: 1,
                "& span": {
                  color: theme.palette.mode === "light" ? "#586069" : "#8b949e",
                },
              }}
            >
              {option.label}
            </Box>
            <Box
              component={CloseIcon}
              sx={{ opacity: 0.6, width: 18, height: 18 }}
              style={{
                visibility: selected ? "visible" : "hidden",
              }}
            />
          </li>
        )}
        options={options}
        getOptionLabel={(option) => option.label ?? option.value}
        renderInput={(params) => (
          <StyledTextField
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus
            placeholder={t("common:filter")}
            variant="outlined"
            size="small"
          />
        )}
        filterOptions={(o) => o}
        isOptionEqualToValue={(
          option: TableFilterOption,
          value: TableFilterOption
        ) => option.value === value.value}
        loading={loading}
        filterSelectedOptions={false}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue);
        }}
      />
    </TableFilter>
  );
};

interface TableDateFilterProps {
  label: string;
  onValueChange?: (value: TableFilterValueDate) => void;
  onCloseWhileEmpty?: () => void;
}
const TableDateFilter = (props: TableDateFilterProps) => {
  const [value, _setValue] = useState<TableFilterValueDate>({
    dateMin: null,
    dateMax: null,
  });
  const [pendingValue, setPendingValue] = useState<TableFilterValueDate>({
    dateMin: null,
    dateMax: null,
  });

  const setValue = (value: TableFilterValueDate) => {
    _setValue(value);
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  //TODO: Make sure, that !(maxDate < minDate)

  return (
    <TableFilter
      label={props.label}
      value={value}
      onOpen={() => setPendingValue(value)}
      onClose={() => {
        if (
          pendingValue.dateMax !== value.dateMax ||
          pendingValue.dateMin !== value.dateMin
        ) {
          setValue(pendingValue);
        } else if (
          !value.dateMax &&
          !value.dateMin &&
          props.onCloseWhileEmpty
        ) {
          props.onCloseWhileEmpty();
        }
      }}
      onClear={
        pendingValue.dateMax || pendingValue.dateMin
          ? () =>
              setPendingValue({
                dateMin: null,
                dateMax: null,
              })
          : undefined
      }
      onDelete={() =>
        setValue({
          dateMin: null,
          dateMax: null,
        })
      }
    >
      <Box padding={2}>
        <Box display="flex" mb={2}>
          <Box flexGrow={1}>
            <DateTimePicker
              label="Min"
              value={stringToDateTime(pendingValue.dateMin)}
              onChange={(value) => {
                setPendingValue((currentValue) => {
                  return {
                    ...currentValue,
                    dateMin: value ? value.toISOString() : null,
                  };
                });
              }}
              slotProps={{ textField: { variant: "outlined", size: "small" } }}
            />
          </Box>
          <Box display="flex" alignItems="center" ml={1}>
            <IconButton
              size="small"
              onClick={() =>
                setPendingValue((currentValue) => {
                  return { ...currentValue, dateMin: null };
                })
              }
            >
              <Clear fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box display="flex">
          <Box flexGrow={1}>
            <DateTimePicker
              label="Max"
              value={stringToDateTime(pendingValue.dateMax)}
              onChange={(value) => {
                setPendingValue((currentValue) => {
                  return {
                    ...currentValue,
                    dateMax: value ? value.toISOString() : null,
                  };
                });
              }}
              slotProps={{ textField: { variant: "outlined", size: "small" } }}
            />
          </Box>
          <Box display="flex" alignItems="center" ml={1}>
            <IconButton
              size="small"
              onClick={() => {
                setPendingValue((currentValue) => {
                  return { ...currentValue, dateMax: null };
                });
              }}
            >
              <Clear fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </TableFilter>
  );
};

interface TableStringFilterProps {
  label: string;
  type: "text" | "number";
  onValueChange?: (value: string) => void;
  onCloseWhileEmpty?: () => void;
}
const TableStringFilter = (props: TableStringFilterProps) => {
  const [value, _setValue] = useState("");
  const [pendingValue, setPendingValue] = useState("");

  const setValue = (value: string) => {
    _setValue(value);
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  //TODO: Make sure, that !(maxDate < minDate)

  return (
    <TableFilter
      label={props.label}
      value={value}
      onOpen={() => setPendingValue(value)}
      onClose={() => {
        if (pendingValue !== value) {
          setValue(pendingValue);
        } else if (!value && props.onCloseWhileEmpty) {
          props.onCloseWhileEmpty();
        }
      }}
      onClear={pendingValue ? () => setPendingValue("") : undefined}
      onDelete={() => setValue("")}
    >
      <Box padding={2}>
        <Box display="flex" mb={2}>
          <Box flexGrow={1}>
            <TextField
              fullWidth
              size="small"
              value={pendingValue}
              onChange={(e) => {
                setPendingValue(e.target.value);
              }}
              type={props.type}
            />
          </Box>
        </Box>
      </Box>
    </TableFilter>
  );
};

export default TableFilters;
