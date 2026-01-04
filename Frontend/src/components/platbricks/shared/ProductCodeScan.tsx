import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useProductService } from "services/ProductService";
import { useInventoryService } from "services/InventoryService";
import { useState, KeyboardEvent, useEffect, useRef } from "react";

export type ProductCodeOption = {
  label: string;
  value: string;
  data?: any;
};

type ProductCodeScanProps = {
  label?: string;
  value?: string;
  onResolved: (option: ProductCodeOption) => void;
  onNotFound?: (code: string) => void;
  onBlur?: () => void;
  helperText?: React.ReactNode;
  error?: boolean;
  showNotFoundDialog?: boolean;
  allowOnlyAvailable?: boolean;
  selectTextOnSubmit?: boolean;
  resolveOnSelect?: boolean;
  optionFilter?: (option: any) => boolean;
  warehouseId?: string | null;
  requireWarehouse?: boolean;
  warehousePromptText?: string;
  onRequireWarehouse?: () => void;
  bypassWarehouseCodes?: string[];
};

const ProductCodeScan: React.FC<ProductCodeScanProps> = ({
  label = "Barcode / Product Code",
  value,
  onResolved,
  onNotFound,
  onBlur,
  helperText,
  error,
  showNotFoundDialog = true,
  allowOnlyAvailable = false,
  selectTextOnSubmit = false,
  resolveOnSelect = true,
  optionFilter,
  warehouseId,
  requireWarehouse = false,
  warehousePromptText = "Please select a warehouse before scanning.",
  onRequireWarehouse,
  bypassWarehouseCodes = [],
}) => {
  const productService = useProductService();
  const inventoryService = useInventoryService();
  const [text, setText] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [options, setOptions] = useState<ProductCodeOption[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [warehouseDialog, setWarehouseDialog] = useState(false);
  const emptyGuid = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    setText(value ?? "");
  }, [value]);

  const lookup = async () => {
    const code = text.trim();
    if (!code) return;
    const codeUpper = code.toUpperCase();
    const allowBypass =
      requireWarehouse &&
      Array.isArray(bypassWarehouseCodes) &&
      bypassWarehouseCodes.some((c) => c.toUpperCase() === codeUpper);

    const warehouseMissing =
      requireWarehouse &&
      !allowBypass &&
      (!warehouseId ||
        warehouseId === "" ||
        warehouseId === emptyGuid ||
        warehouseId === null);

    if (warehouseMissing) {
      setWarehouseDialog(true);
      onRequireWarehouse?.();
      return;
    }
    setLoading(true);
    try {
      const results = allowOnlyAvailable
        ? await inventoryService.searchSummary({
            search: code,
            page: 1,
            pageSize: 1,
            warehouseId: (warehouseId as any) ?? null,
            minQuantity: 1,
          })
        : await productService.getSelectOptions(code, 1, 1);
      const rawItems = Array.isArray((results as any)?.data)
        ? (results as any).data
        : Array.isArray((results as any)?.data?.data)
        ? (results as any).data.data
        : Array.isArray(results)
        ? (results as any)
        : [];

      const items = optionFilter
        ? rawItems.filter(optionFilter)
        : allowOnlyAvailable
        ? rawItems.filter(
            (r: any) => (r.availableQuantity ?? r.quantity ?? 0) > 0
          )
        : rawItems;
      const first = items[0];
      if (first) {
        onResolved({
          label:
            first.label ??
            first.productCode ??
            first.product?.productCode ??
            code,
          value:
            first.value ??
            first.id ??
            first.productId ??
            first.productCode ??
            first.product?.productId ??
            code,
          data: first.data ?? first,
        });
      } else {
        if (onNotFound) onNotFound(code);
        if (showNotFoundDialog) setNotFoundCode(code);
      }
    } catch {
      if (onNotFound) onNotFound(code);
      if (showNotFoundDialog) setNotFoundCode(code);
    } finally {
      setLoading(false);
      if (selectTextOnSubmit && inputRef.current) {
        inputRef.current.select();
      }
    }
  };

  const fetchOptions = async (input: string) => {
    const term = input.trim();
    if (!term) {
      setOptions([]);
      return;
    }
    const termUpper = term.toUpperCase();
    const allowBypass =
      requireWarehouse &&
      Array.isArray(bypassWarehouseCodes) &&
      bypassWarehouseCodes.some((c) => c.toUpperCase() === termUpper);

    const warehouseMissing =
      requireWarehouse &&
      !allowBypass &&
      (!warehouseId ||
        warehouseId === "" ||
        warehouseId === emptyGuid ||
        warehouseId === null);

    if (warehouseMissing) {
      setWarehouseDialog(true);
      onRequireWarehouse?.();
      return;
    }
    setLoading(true);
    try {
      const results = allowOnlyAvailable
        ? await inventoryService.searchSummary({
            search: term,
            page: 1,
            pageSize: 10,
            warehouseId: (warehouseId as any) ?? null,
            minQuantity: 1,
          })
        : await productService.getSelectOptions(term, 1, 10);
      const raw = Array.isArray((results as any)?.data)
        ? (results as any).data
        : Array.isArray((results as any)?.data?.data)
        ? (results as any).data.data
        : Array.isArray(results)
        ? (results as any)
        : [];

      const filtered = optionFilter
        ? raw.filter(optionFilter)
        : allowOnlyAvailable
        ? raw.filter((r: any) => (r.availableQuantity ?? r.quantity ?? 0) > 0)
        : raw;

      const mapped = filtered.map((r: any) => ({
        label:
          r.label ?? r.productCode ?? r.product?.productCode ?? r.value ?? term,
        value:
          r.value ??
          r.id ??
          r.productId ??
          r.product?.productId ??
          r.productCode ??
          r.label ??
          term,
        data: r.data ?? r,
      }));
      setOptions(mapped);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      lookup();
    }
  };

  return (
    <>
      <Autocomplete
        fullWidth
        size="small"
        freeSolo
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.label
        }
        onInputChange={(_, newValue, reason) => {
          setText(newValue);
          if (reason !== "reset") {
            fetchOptions(newValue);
          }
        }}
        onChange={(_, newValue) => {
          if (!newValue) return;
          if (typeof newValue === "string") {
            setText(newValue);
          } else {
            setText(newValue.label);
            if (resolveOnSelect) {
              onResolved(newValue);
            }
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            helperText={
              requireWarehouse &&
              (!warehouseId ||
                warehouseId === "" ||
                warehouseId === emptyGuid ||
                warehouseId === null)
                ? warehousePromptText
                : helperText
            }
            error={
              error ||
              (requireWarehouse &&
                (!warehouseId ||
                  warehouseId === "" ||
                  warehouseId === emptyGuid ||
                  warehouseId === null))
            }
            inputRef={inputRef}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Dialog open={!!notFoundCode} onClose={() => setNotFoundCode(null)}>
        <DialogTitle>Product Code Not Found</DialogTitle>
        <DialogContent>
          <Typography>
            No product found for code: <strong>{notFoundCode}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotFoundCode(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={warehouseDialog} onClose={() => setWarehouseDialog(false)}>
        <DialogTitle>Warehouse Required</DialogTitle>
        <DialogContent>
          <Typography>{warehousePromptText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarehouseDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCodeScan;
