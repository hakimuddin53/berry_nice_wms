import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";

type ProductCodeScanStockTakeProps = {
  warehouseId?: string | null;
  onResolved: (code: string) => void;
  onMissing: (code: string, existsElsewhere: boolean) => void;
  helperText?: React.ReactNode;
  error?: boolean;
  label?: string;
};

const SERVICE_CODES = ["POSTAGE", "LALAMOVE", "ACCESSORY"];

const ProductCodeScanStockTake: React.FC<ProductCodeScanStockTakeProps> = ({
  warehouseId,
  onResolved,
  onMissing,
  helperText,
  error,
  label = "Scan barcode",
}) => {
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [warehouseDialog, setWarehouseDialog] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setText("");
  }, [warehouseId]);

  const selectAll = () => {
    if (inputRef.current) inputRef.current.select();
  };

  const handleLookup = async () => {
    const code = text.trim();
    if (!code) return;
    if (
      !warehouseId ||
      warehouseId === "" ||
      warehouseId === "00000000-0000-0000-0000-000000000000"
    ) {
      setWarehouseDialog(true);
      return;
    }
    setLoading(true);
    try {
      const res = await inventoryService.searchSummary({
        search: code,
        page: 1,
        pageSize: 1,
        warehouseId: warehouseId as any,
      });
      const rows = Array.isArray((res as any)?.data)
        ? (res as any).data
        : Array.isArray((res as any)?.data?.data)
        ? (res as any).data.data
        : Array.isArray(res)
        ? (res as any)
        : [];
      const filtered = rows.filter(
        (r: any) =>
          !SERVICE_CODES.includes((r.productCode ?? r.code ?? "").toUpperCase())
      );
      if (filtered.length > 0) {
        onResolved(code);
      } else {
        const options = await productService.getSelectOptions(code, 1, 1);
        const existsElsewhere = Array.isArray(options) && options.length > 0;
        onMissing(code, existsElsewhere);
      }
    } catch {
      onMissing(code, false);
    } finally {
      setLoading(false);
      selectAll();
    }
  };

  const fetchOptions = async (term: string) => {
    const search = term.trim();
    if (!search) {
      setOptions([]);
      return;
    }
    try {
      const results = await productService.getSelectOptions(search, 1, 10);
      const mapped = (results ?? [])
        .filter((r: any) => {
          const code = (
            r.productCode ??
            r.label ??
            r.value ??
            ""
          ).toUpperCase();
          return !SERVICE_CODES.includes(code);
        })
        .map((r: any) => ({
          label: r.label ?? r.productCode ?? r.value ?? search,
          value: r.value ?? r.id ?? r.productId ?? r.productCode ?? search,
        }));
      setOptions(mapped);
    } catch {
      setOptions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  };

  return (
    <>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={text}
        onInputChange={(_, val) => {
          setText(val);
          fetchOptions(val);
        }}
        onChange={(_, val) => {
          if (typeof val === "string") {
            setText(val);
          } else if (val?.label) {
            setText(val.label);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={label}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            helperText={helperText}
            error={error}
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
      <Dialog open={warehouseDialog} onClose={() => setWarehouseDialog(false)}>
        <DialogTitle>Warehouse Required</DialogTitle>
        <DialogContent>
          <Typography>Select a warehouse before scanning.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarehouseDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCodeScanStockTake;
