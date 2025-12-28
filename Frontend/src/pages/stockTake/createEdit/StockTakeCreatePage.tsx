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
import { useFormik } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import {
  StockTakeCreateDto,
  StockTakeCreateItemDto,
} from "interfaces/v12/stockTake/stockTakeCreateDto";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useProductService } from "services/ProductService";
import { useStockTakeService } from "services/StockTakeService";
import * as Yup from "yup";
import { Add, Delete } from "@mui/icons-material";
import { useCallback } from "react";

const validationSchema = Yup.object({
  warehouseId: Yup.string().required("Warehouse is required"),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required("Product is required"),
        countedQuantity: Yup.number()
          .min(0, "Quantity cannot be negative")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one item is required"),
});

const StockTakeCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stockTakeService = useStockTakeService();
  const productService = useProductService();

  const formik = useFormik<StockTakeCreateDto>({
    initialValues: {
      warehouseId: "",
      items: [
        { productId: "", countedQuantity: 0 },
      ] as StockTakeCreateItemDto[],
      remark: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await stockTakeService.create(values);
        navigate("/stock-take");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          t("common:request-failed", { defaultValue: "Request failed" });
        setErrors({ warehouseId: message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const updateItem = useCallback(
    (index: number, item: Partial<StockTakeCreateItemDto>) => {
      const nextItems = [...formik.values.items];
      nextItems[index] = { ...nextItems[index], ...item };
      formik.setFieldValue("items", nextItems);
    },
    [formik]
  );

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      { productId: "", countedQuantity: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const nextItems = [...formik.values.items];
    nextItems.splice(index, 1);
    formik.setFieldValue("items", nextItems);
  };

  return (
    <Page
      title={t("stock-take", { defaultValue: "Stock Take" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        {
          label: t("stock-take", { defaultValue: "Stock Take" }),
          to: "/stock-take",
        },
        { label: t("new-stock-take", { defaultValue: "New Stock Take" }) },
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
                  name="warehouseId"
                  value={formik.values.warehouseId}
                  onChange={(value) =>
                    formik.setFieldValue("warehouseId", value || "")
                  }
                  onBlur={() => formik.setFieldTouched("warehouseId")}
                  error={
                    formik.touched.warehouseId &&
                    Boolean(formik.errors.warehouseId)
                  }
                  helperText={
                    formik.touched.warehouseId && formik.errors.warehouseId
                  }
                  label={t("warehouse")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="remark"
                  label={t("remark")}
                  size="small"
                  value={formik.values.remark ?? ""}
                  onChange={formik.handleChange}
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
                        name={`items[${index}].countedQuantity`}
                        label={t("counted-quantity", {
                          defaultValue: "Counted Qty",
                        })}
                        size="small"
                        inputProps={{ min: 0 }}
                        value={item.countedQuantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          Boolean(
                            (formik.errors.items as any)?.[index]
                              ?.countedQuantity
                          ) && Boolean(formik.touched.items)
                        }
                        helperText={
                          (formik.errors.items as any)?.[index]?.countedQuantity
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
            <Button variant="outlined" onClick={() => navigate("/stock-take")}>
              {t("common:cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {t("common:save")}
            </Button>
          </Box>
        </Stack>
      </form>
    </Page>
  );
};

export default StockTakeCreatePage;
