import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useLookupSelectOptionsFetcher } from "hooks/queries/useLookupQueries";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import React from "react";
import { useTranslation } from "react-i18next";
import LookupQuickCreateDialog from "./dialogs/LookupQuickCreateDialog";

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
  allowCreate?: boolean;
  onChange: (value: string, option?: LookupOption | null) => void;
}

interface LookupOption {
  label: string;
  value: string;
}

const dedupeOptions = (options: LookupOption[]) => {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
};

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
  allowCreate,
  onChange,
}) => {
  const { t } = useTranslation();
  const fetchLookupOptions = useLookupSelectOptionsFetcher();

  const [options, setOptions] = React.useState<LookupOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [pendingLabel, setPendingLabel] = React.useState("");

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
            (await fetchLookupOptions(groupKey, "", page, PAGE_SIZE)) ?? [];
          if (chunk.length === 0) {
            break;
          }
          nextOptions.push(...chunk);
          if (chunk.length < PAGE_SIZE) {
            break;
          }
          page += 1;
        }
        const dedupedOptions = dedupeOptions(nextOptions);
        if (isActive) {
          setOptions(dedupedOptions);
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
  }, [fetchLookupOptions, groupKey]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return (
      options.find((option) => option.value === value) ??
      options.find((option) => option.label === value) ??
      null
    );
  }, [options, value]);

  const handleAddClicked = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setPendingLabel(trimmed);
    setShowCreateDialog(true);
  };

  const handleCreated = (created: { id: string; label: string }) => {
    const newOption = { value: created.id, label: created.label };
    setOptions((prev) => dedupeOptions([...prev, newOption]));
    setShowCreateDialog(false);
    setPendingLabel("");
    onChange(newOption.value, newOption);
  };

  const canShowCreate =
    allowCreate !== false &&
    !readOnly &&
    !disabled &&
    inputValue.trim().length > 0;

  return (
    <>
      <Autocomplete<LookupOption, false, boolean | undefined, false>
        disableClearable={disableClearable}
        disabled={disabled}
        fullWidth
        loading={loading}
        options={options}
        value={selectedOption}
        readOnly={readOnly}
        inputValue={inputValue}
        onInputChange={(_, newValue, reason) => {
          if (reason === "input") {
            setInputValue(newValue);
          }
        }}
        getOptionLabel={(option) => option?.label ?? ""}
        isOptionEqualToValue={(option, optionValue) =>
          option.value === optionValue.value
        }
        onChange={(_, newValue) => {
          onChange(newValue?.value ?? "", newValue ?? null);
        }}
        onBlur={onBlur}
        noOptionsText={
          canShowCreate ? (
            <Button
              fullWidth
              size="small"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleAddClicked(inputValue)}
            >
              {t("common:add")}
            </Button>
          ) : (
            t("common:no-result")
          )
        }
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
      {allowCreate !== false && !readOnly && !disabled && (
        <LookupQuickCreateDialog
          open={showCreateDialog}
          initialLabel={pendingLabel || inputValue}
          groupKey={groupKey}
          initialSortOrder={options.length + 1}
          onClose={() => {
            setShowCreateDialog(false);
            setPendingLabel("");
          }}
          onCreated={handleCreated}
        />
      )}
    </>
  );
};

export default LookupAutocomplete;
