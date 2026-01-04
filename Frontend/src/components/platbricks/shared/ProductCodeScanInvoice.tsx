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

type ProductCodeScanInvoiceProps = {
  warehouseId?: string | null;
  onResolved: (option: { productCode: string; productId: string }) => void;
  helperText?: React.ReactNode;
  error?: boolean;
  label?: string;
  serviceCodes?: string[];
};

const DEFAULT_SERVICE_CODES = ["POSTAGE", "LALAMOVE", "ACCESSORY"];

const ProductCodeScanInvoice: React.FC<ProductCodeScanInvoiceProps> = ({
  warehouseId,
  onResolved,
  helperText,
  error,
  label = "Product Code",
  serviceCodes = DEFAULT_SERVICE_CODES,
}) => {
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [warehouseDialog, setWarehouseDialog] = useState(false);
  const [options, setOptions] = useState<
    { label: string; productCode: string; productId: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setText("");
  }, [warehouseId]);

  const selectAll = () => {
    if (inputRef.current) inputRef.current.select();
  };

  const lookup = async () => {
    const code = text.trim();
    if (!code) return;
    const codeUpper = code.toUpperCase();
    const allowBypass = serviceCodes.some((c) => c.toUpperCase() === codeUpper);
    const warehouseMissing =
      !warehouseId ||
      warehouseId === "" ||
      warehouseId === "00000000-0000-0000-0000-000000000000";

    if (warehouseMissing && !allowBypass) {
      setWarehouseDialog(true);
      return;
    }
    setLoading(true);
    try {
      if (allowBypass) {
        const serviceResults = await productService.getSelectOptions(
          code,
          1,
          1
        );
        const serviceOption = (serviceResults ?? []).find((r: any) => {
          const productCode = (
            r.productCode ??
            r.label ??
            r.value ??
            ""
          ).toUpperCase();
          return serviceCodes.some((svc) => svc.toUpperCase() === productCode);
        }) as any;
        if (serviceOption) {
          onResolved({
            productCode: serviceOption.productCode ?? code,
            productId:
              serviceOption.value ??
              serviceOption.id ??
              serviceOption.productId ??
              code,
          });
        } else {
          setNotFoundCode(code);
        }
      } else {
        const res = await inventoryService.searchSummary({
          search: code,
          page: 1,
          pageSize: 1,
          warehouseId: warehouseId as any,
          minQuantity: 1,
        });
        const rows = Array.isArray((res as any)?.data)
          ? (res as any).data
          : Array.isArray((res as any)?.data?.data)
          ? (res as any).data.data
          : Array.isArray(res)
          ? (res as any)
          : [];
        if (rows.length > 0) {
          const r = rows[0];
          onResolved({
            productCode: r.productCode ?? code,
            productId: r.productId,
          });
        } else {
          setNotFoundCode(code);
        }
      }
    } catch {
      setNotFoundCode(code);
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
    const warehouseMissing =
      !warehouseId ||
      warehouseId === "" ||
      warehouseId === "00000000-0000-0000-0000-000000000000";

    try {
      const serviceResults = await productService.getSelectOptions(
        search,
        1,
        10
      );
      const serviceOptions = (serviceResults ?? [])
        .filter((r: any) => {
          const code = (
            r.productCode ??
            r.label ??
            r.value ??
            ""
          ).toUpperCase();
          return serviceCodes.some((svc) => svc.toUpperCase() === code);
        })
        .map((r: any) => ({
          label: r.label ?? r.productCode ?? r.value ?? search,
          productCode: r.productCode ?? r.label ?? r.value ?? search,
          productId: r.value ?? r.id ?? r.productId ?? r.productCode ?? search,
        }));

      const inventoryOptions = warehouseMissing
        ? []
        : await inventoryService.searchSummary({
            search,
            page: 1,
            pageSize: 10,
            warehouseId: warehouseId as any,
            minQuantity: 1,
          });

      const rows = Array.isArray((inventoryOptions as any)?.data)
        ? (inventoryOptions as any).data
        : Array.isArray((inventoryOptions as any)?.data?.data)
        ? (inventoryOptions as any).data.data
        : Array.isArray(inventoryOptions)
        ? (inventoryOptions as any)
        : [];

      const inventoryMapped = rows.map((r: any) => ({
        label: r.productCode ?? r.productId ?? search,
        productCode: r.productCode ?? search,
        productId: r.productId,
      }));

      const merged = new Map<
        string,
        { label: string; productCode: string; productId: string }
      >();
      serviceOptions.forEach((opt) =>
        merged.set(opt.productCode.toUpperCase(), opt)
      );
      inventoryMapped.forEach((opt: any) =>
        merged.set(opt.productCode.toUpperCase(), opt)
      );
      setOptions(Array.from(merged.values()));
    } catch {
      setOptions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      lookup();
    }
  };

  return (
    <>
      <Autocomplete
        freeSolo
        fullWidth
        size="small"
        options={options}
        inputValue={text}
        onInputChange={(_, val) => {
          setText(val);
          fetchOptions(val);
        }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.label
        }
        onChange={(_, val) => {
          if (!val) return;
          const selected =
            typeof val === "string"
              ? options.find(
                  (opt) => opt.productCode.toUpperCase() === val.toUpperCase()
                )
              : (val as any);
          if (selected && selected.productCode && selected.productId) {
            setText(selected.productCode);
            onResolved({
              productCode: selected.productCode,
              productId: selected.productId,
            });
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
            helperText={
              !warehouseId ||
              warehouseId === "" ||
              warehouseId === "00000000-0000-0000-0000-000000000000"
                ? "Select a warehouse before scanning."
                : helperText
            }
            error={
              error ||
              !warehouseId ||
              warehouseId === "" ||
              warehouseId === "00000000-0000-0000-0000-000000000000"
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
          <Typography>Select a warehouse before scanning.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarehouseDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCodeScanInvoice;
