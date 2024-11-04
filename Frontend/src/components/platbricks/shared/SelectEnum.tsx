import { Autocomplete, Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectAsyncOption } from "./SelectAsync2";
import { SelectOption } from "./ValueFilter";

interface SelectEnumProps {
  name: string;
  enumType: any;
  error?: boolean;
  onBlur?: () => void;
  selectedEnumValues?: any[];
  selectedEnumValue?: any | null;
  onSelectedEnumValueMultipleChanged?: (
    selectedEnumValues: SelectAsyncOption[]
  ) => void;
  onSelectedEnumValueChanged?: (
    selectedEnumValue: SelectAsyncOption | null
  ) => void;
  multiple?: boolean;
  disabledEnumValues?: string[];
  disabled?: boolean;
  disableClearable?: boolean;
}

const SelectEnum = (props: SelectEnumProps) => {
  const { t } = useTranslation("enumerables");

  const enumSelectOptions = Object.values(props.enumType).map((p) => {
    return {
      value: p,
      label: t(p as string),
    } as SelectOption;
  });

  return props.multiple ?? false ? (
    <Autocomplete
      id={`selectEnum_${props.name}`}
      options={enumSelectOptions}
      multiple
      isOptionEqualToValue={(option, value) => option.value === value.value}
      value={props.selectedEnumValues}
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
        if (props.onSelectedEnumValueMultipleChanged) {
          props.onSelectedEnumValueMultipleChanged(value);
        }
      }}
    />
  ) : (
    <Autocomplete
      id={"selectEnum_" + props.enumType.toString()}
      options={enumSelectOptions}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      value={props.selectedEnumValues}
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
        if (props.onSelectedEnumValueChanged) {
          props.onSelectedEnumValueChanged(value);
        }
      }}
    />
  );
};

export default SelectEnum;
