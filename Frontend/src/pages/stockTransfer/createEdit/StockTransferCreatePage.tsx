import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import Page from "components/platbricks/shared/Page";
import SelectAsync, {
  SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import {
  StockTransferCreateDto,
  StockTransferCreateItemDto,
} from "interfaces/v12/stockTransfer/stockTransferCreateDto";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useProductService } from "services/ProductService";
import { useStockTransferService } from "services/StockTransferService";
import * as Yup from "yup";
import { useCallback } from "react";
import { Add, Delete } from "@mui/icons-material";

const validationSchema = Yup.object({
  fromWarehouseId: Yup.string().required("From warehouse is required"),
  toWarehouseId: Yup.string().required("To warehouse is required"),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required("Product is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one item is required"),
});

const StockTransferCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stockTransferService = useStockTransferService();
  const productService = useProductService();

  const formik = useFormik<StockTransferCreateDto>({
    initialValues: {
      fromWarehouseId: "",
      toWarehouseId: "",
      items: [{ productId: "", quantity: 1 }] as StockTransferCreateItemDto[],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await stockTransferService.create(values);
        navigate("/stock-transfer");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          t("common:request-failed", { defaultValue: "Request failed" });
        setErrors({ fromWarehouseId: message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const updateItem = useCallback(
    (index: number, item: Partial<StockTransferCreateItemDto>) => {
      const nextItems = [...formik.values.items];
      nextItems[index] = { ...nextItems[index], ...item };
      formik.setFieldValue("items", nextItems);
    },
    [formik]
  );

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      { productId: "", quantity: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    const nextItems = [...formik.values.items];
    nextItems.splice(index, 1);
    formik.setFieldValue("items", nextItems);
  };

  return (
    <Page
      title={t("stock-transfer", { defaultValue: "Stock Transfer" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        {
          label: t("stock-transfer", { defaultValue: "Stock Transfer" }),
          to: "/stock-transfer",
        },
        { label: t("new-transfer", { defaultValue: "New Transfer" }) },
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("common:details")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Warehouse}
                  name="fromWarehouseId"
                  value={formik.values.fromWarehouseId}
                  onChange={(value) =>
                    formik.setFieldValue("fromWarehouseId", value || "")
                  }
                  onBlur={() => formik.setFieldTouched("fromWarehouseId")}
                  error={
                    formik.touched.fromWarehouseId &&
                    Boolean(formik.errors.fromWarehouseId)
                  }
                  helperText={
                    formik.touched.fromWarehouseId &&
                    formik.errors.fromWarehouseId
                  }
                  label={t("from-warehouse", {
                    defaultValue: "From Warehouse",
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Warehouse}
                  name="toWarehouseId"
                  value={formik.values.toWarehouseId}
                  onChange={(value) =>
                    formik.setFieldValue("toWarehouseId", value || "")
                  }
                  onBlur={() => formik.setFieldTouched("toWarehouseId")}
                  error={
                    formik.touched.toWarehouseId &&
                    Boolean(formik.errors.toWarehouseId)
                  }
                  helperText={
                    formik.touched.toWarehouseId && formik.errors.toWarehouseId
                  }
                  label={t("to-warehouse", { defaultValue: "To Warehouse" })}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">
                {t("items", { defaultValue: "Items" })}
              </Typography>
              <Button startIcon={<Add />} onClick={addItem}>
                {t("add-item", { defaultValue: "Add Item" })}
              </Button>
            </Stack>

            <Stack spacing={2}>
              {formik.values.items.map((item, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, backgroundColor: "background.default" }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <SelectAsync
                        name={`items[${index}].productId`}
                        label={t("product")}
                        asyncFunc={(value, page, pageSize) =>
                          productService.getSelectOptions(value, page, pageSize)
                        }
                        onSelectionChange={(
                          selection: SelectAsyncOption | null
                        ) =>
                          updateItem(index, {
                            productId: selection?.value ?? "",
                          })
                        }
                        initValue={
                          item.productId
                            ? {
                                value: item.productId,
                                label: item.productId,
                              }
                            : undefined
                        }
                        error={
                          Boolean(
                            (formik.errors.items as any)?.[index]?.productId
                          ) && Boolean(formik.touched.items)
                        }
                        helperText={
                          (formik.errors.items as any)?.[index]?.productId
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        name={`items[${index}].quantity`}
                        label={t("quantity")}
                        size="small"
                        inputProps={{ min: 1 }}
                        value={item.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          Boolean(
                            (formik.errors.items as any)?.[index]?.quantity
                          ) && Boolean(formik.touched.items)
                        }
                        helperText={
                          (formik.errors.items as any)?.[index]?.quantity
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        name={`items[${index}].remark`}
                        label={t("remark")}
                        size="small"
                        value={item.remark ?? ""}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={1} textAlign="right">
                      <IconButton
                        aria-label={t("remove")}
                        onClick={() => removeItem(index)}
                        disabled={formik.values.items.length === 1}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/stock-transfer")}
            >
              {t("common:cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                formik.values.fromWarehouseId === formik.values.toWarehouseId
              }
            >
              {t("common:save")}
            </Button>
          </Box>
        </Stack>
      </form>
    </Page>
  );
};

export default StockTransferCreatePage;
