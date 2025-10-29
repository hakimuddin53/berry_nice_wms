import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLookupService } from "services/LookupService";

interface LookupAutocompleteProps {
  groupKey: LookupGroupKey;
  name: string;
  value?: string;
  label?: string;
  helperText?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onBlur?: () => void;
  disableClearable?: boolean;
  onChange: (value: string, option?: LookupOption | null) => void;
}

interface LookupOption {
  label: string;
  value: string;
}

const PAGE_SIZE = 50;

const LookupAutocomplete: React.FC<LookupAutocompleteProps> = ({
  groupKey,
  name,
  value = "",
  label,
  helperText,
  error,
  disabled,
  readOnly,
  placeholder,
  onBlur,
  disableClearable,
  onChange,
}) => {
  const { t } = useTranslation();
  const lookupService = useLookupService();

  const [options, setOptions] = React.useState<LookupOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    let isActive = true;

    const fetchAllOptions = async () => {
      setLoading(true);
      const nextOptions: LookupOption[] = [];
      let page = 1;
      try {
        while (true) {
          const chunk =
            (await lookupService.getSelectOptions(
              groupKey,
              "",
              page,
              PAGE_SIZE
            )) ?? [];
          if (chunk.length === 0) {
            break;
          }
          nextOptions.push(...chunk);
          if (chunk.length < PAGE_SIZE) {
            break;
          }
          page += 1;
        }
        if (isActive) {
          setOptions(nextOptions);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error(
            `LookupAutocomplete failed to load options for ${groupKey}`,
            err
          );
        }
        if (isActive) {
          setOptions([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchAllOptions();

    return () => {
      isActive = false;
    };
  }, [groupKey]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return (
      options.find((option) => option.value === value) ??
      options.find((option) => option.label === value) ??
      null
    );
  }, [options, value]);

  return (
    <Autocomplete<LookupOption, false, boolean | undefined, false>
      disableClearable={disableClearable}
      disabled={disabled}
      fullWidth
      loading={loading}
      options={options}
      value={selectedOption}
      readOnly={readOnly}
      getOptionLabel={(option) => option?.label ?? ""}
      isOptionEqualToValue={(option, optionValue) =>
        option.value === optionValue.value
      }
      onChange={(_, newValue) => {
        onChange(newValue?.value ?? "", newValue ?? null);
      }}
      onBlur={onBlur}
      noOptionsText={t("common:no-result")}
      loadingText={t("common:loading")}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          size="small"
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LookupAutocomplete;
