import { Box, Button, TextField } from "@mui/material";
import DataList from "components/platbricks/shared/DataList";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import SelectAsync2, {
  SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync2";
import SupplierQuickCreateDialog, {
  SupplierQuickCreateResult,
} from "components/platbricks/shared/dialogs/SupplierQuickCreateDialog";
import { FormikProps } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSupplierService } from "services/SupplierService";
import { useUserService } from "services/UserService";
import { isRequiredField } from "utils/formikHelpers";
import {
  StockRecieveCreateEditSchema,
  YupStockRecieveCreateEdit,
} from "../yup/StockRecieveCreateEditSchema";

const StockRecieveHeadCreateEdit = (props: {
  formik: FormikProps<YupStockRecieveCreateEdit>;
}) => {
  const { t } = useTranslation("common");
  const formik = props.formik;
  const supplierService = useSupplierService();
  const userService = useUserService();
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [supplierDraftCode, setSupplierDraftCode] = useState("");
  const [supplierDraftName, setSupplierDraftName] = useState("");
  const [supplierExistsSelected, setSupplierExistsSelected] = useState(false);
  const [supplierInput, setSupplierInput] = useState("");

  const sellerInfoIds = useMemo(
    () => (formik.values.sellerInfo?.trim() ? [formik.values.sellerInfo] : []),
    [formik.values.sellerInfo]
  );

  const purchaserIds = useMemo(
    () => (formik.values.purchaser ? [formik.values.purchaser] : []),
    [formik.values.purchaser]
  );

  const createStaticOptions = useCallback((ids?: string[]) => {
    if (!ids || ids.length === 0) {
      return [] as SelectAsyncOption[];
    }

    return ids
      .filter((value) => !!value)
      .map(
        (value) =>
          ({
            label: value,
            value,
          } as SelectAsyncOption)
      );
  }, []);

  const normalizeOptions = useCallback((options: SelectAsyncOption[] = []) => {
    return options.map(
      (option) =>
        ({
          label: option.label ?? "",
          value: option.label ?? "",
        } as SelectAsyncOption)
    );
  }, []);

  const normalizeUserOptions = useCallback(
    (options: SelectAsyncOption[] = []) => {
      return options.map(
        (option) =>
          ({
            label: option.label ?? "",
            value: option.value ?? option.label ?? "",
          } as SelectAsyncOption)
      );
    },
    []
  );

  const supplierAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      if (ids && ids.length > 0) {
        return createStaticOptions(ids);
      }

      const options = await supplierService.getSelectOptions(
        input,
        page,
        pageSize
      );
      return normalizeOptions(options);
    },
    [createStaticOptions, normalizeOptions, supplierService]
  );

  const userAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      const results = await userService.getSelectOptions(
        input ?? "",
        page,
        pageSize,
        ids
      );

      // If we have preselected ids and no search text, include the first page of all users too
      if ((ids?.length ?? 0) > 0 && (input ?? "").trim().length === 0) {
        const general = await userService.getSelectOptions("", 1, pageSize, []);
        const seen = new Set<string>();
        const merged = [...results, ...general].filter((opt) => {
          const key = opt.value ?? opt.label ?? "";
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return normalizeUserOptions(merged);
      }

      return normalizeUserOptions(results);
    },
    [normalizeUserOptions, userService]
  );

  const handleSupplierCreated = useCallback(
    (supplier: SupplierQuickCreateResult) => {
      formik.setFieldValue("sellerInfo", supplier.supplierCode);
      formik.setFieldTouched("sellerInfo", true, false);
      setSupplierDialogOpen(false);
    },
    [formik]
  );

  return (
    <>
      <DataList
        hideDevider={true}
        data={[
          {
            label: t("seller-info"),
            required: isRequiredField(
              StockRecieveCreateEditSchema,
              "sellerInfo",
              formik.values
            ),
            value: (
              <Box display="flex" flexDirection="column" gap={1} width="100%">
                <SelectAsync2
                  name="sellerInfo"
                  placeholder={t("seller-info")}
                  ids={sellerInfoIds}
                  asyncFunc={supplierAsync}
                  suggestionsIfEmpty
                  fullWidth
                  renderNoOptions={(input) =>
                    supplierExistsSelected ||
                    (input ?? "").trim().length === 0 ? null : (
                      <Button
                        fullWidth
                        size="small"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setSupplierDraftCode(formik.values.sellerInfo ?? "");
                          setSupplierDraftName(
                            input ?? formik.values.sellerInfo ?? ""
                          );
                          setSupplierDialogOpen(true);
                        }}
                      >
                        {t("add-supplier")}
                      </Button>
                    )
                  }
                  onSelectionChange={(option?: SelectAsyncOption) => {
                    formik.setFieldValue("sellerInfo", option?.value ?? "");
                    setSupplierExistsSelected(Boolean(option?.value));
                    if (!option?.value) {
                      setSupplierInput("");
                    }
                  }}
                  onSearchChange={(value) => {
                    setSupplierInput(value ?? "");
                    setSupplierExistsSelected(false);
                  }}
                  onBlur={() => formik.setFieldTouched("sellerInfo", true)}
                  error={
                    formik.touched.sellerInfo &&
                    Boolean(formik.errors.sellerInfo)
                  }
                  helperText={
                    <FormikErrorMessage
                      touched={formik.touched.sellerInfo}
                      error={formik.errors.sellerInfo}
                      translatedFieldName={t("seller-info")}
                    />
                  }
                />
              </Box>
            ),
          },
          {
            label: t("purchaser"),
            required: isRequiredField(
              StockRecieveCreateEditSchema,
              "purchaser",
              formik.values
            ),
            value: (
              <SelectAsync2
                name="purchaser"
                placeholder={t("purchaser")}
                ids={purchaserIds}
                asyncFunc={userAsync}
                suggestionsIfEmpty
                onSelectionChange={(option?: SelectAsyncOption) =>
                  formik.setFieldValue("purchaser", option?.value ?? "")
                }
                onBlur={() => formik.setFieldTouched("purchaser", true)}
                error={
                  formik.touched.purchaser && Boolean(formik.errors.purchaser)
                }
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.purchaser}
                    error={formik.errors.purchaser}
                    translatedFieldName={t("purchaser")}
                  />
                }
              />
            ),
          },
          {
            label: t("date-of-purchase"),
            required: isRequiredField(
              StockRecieveCreateEditSchema,
              "dateOfPurchase",
              formik.values
            ),
            value: (
              <TextField
                fullWidth
                id="dateOfPurchase"
                name="dateOfPurchase"
                type="date"
                size="small"
                value={formik.values.dateOfPurchase}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dateOfPurchase &&
                  Boolean(formik.errors.dateOfPurchase)
                }
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.dateOfPurchase}
                    error={formik.errors.dateOfPurchase}
                    translatedFieldName={t("date-of-purchase")}
                  />
                }
                InputLabelProps={{ shrink: true }}
              />
            ),
          },
          {
            label: t("warehouse"),
            required: isRequiredField(
              StockRecieveCreateEditSchema,
              "warehouseId",
              formik.values
            ),
            value: (
              <LookupAutocomplete
                groupKey={LookupGroupKey.Warehouse}
                name="warehouseId"
                value={formik.values.warehouseId}
                onChange={(value) => formik.setFieldValue("warehouseId", value)}
                onBlur={() => formik.setFieldTouched("warehouseId", true)}
                error={
                  formik.touched.warehouseId &&
                  Boolean(formik.errors.warehouseId)
                }
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.warehouseId}
                    error={formik.errors.warehouseId}
                    translatedFieldName={t("warehouse")}
                  />
                }
              />
            ),
          },
        ]}
      ></DataList>
      <SupplierQuickCreateDialog
        open={supplierDialogOpen}
        initialCode={supplierDraftCode}
        initialName={supplierDraftName}
        onClose={() => setSupplierDialogOpen(false)}
        onCreated={handleSupplierCreated}
      />
    </>
  );
};

export default StockRecieveHeadCreateEdit;
