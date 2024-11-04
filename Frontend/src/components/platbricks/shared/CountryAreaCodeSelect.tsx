import { FilterOptionsState } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Country,
  countries,
} from "interfaces/general/countryAreaCode/countryAreaCode";
import { useCallback, useState } from "react";

interface CountryAreaCodeSelectProps {
  onCountryAreaCodeSelectChanged: (areaCode: string) => void;
  areaCode?: string | null;
}

export const CountryAreaCodeSelect = ({
  onCountryAreaCodeSelectChanged,
  areaCode,
}: CountryAreaCodeSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const filterOptions = useCallback(
    (options: Country[], state: FilterOptionsState<Country>) => {
      return options.filter((o) =>
        o.label.toLowerCase().includes(state.inputValue.toLowerCase())
      );
    },
    []
  );

  return (
    <Autocomplete
      id="country-select"
      options={countries}
      value={countries.find((x) => x.countryCallingCode === areaCode)}
      fullWidth
      size="small"
      autoHighlight
      inputValue={inputValue}
      filterOptions={filterOptions}
      onInputChange={(event, value, reason) => {
        setInputValue(value);
      }}
      getOptionLabel={(option) => {
        return option.countryCallingCode;
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.label}>
          {option.label}
          {option.nativeLabel ? ` (${option.nativeLabel})` : ""}
          {option.countryCallingCode}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={(e, value) => {
        onCountryAreaCodeSelectChanged(value?.countryCallingCode ?? "");
      }}
    />
  );
};
