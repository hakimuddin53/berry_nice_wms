import { CardContent, TextField } from "@mui/material";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useStockInService } from "services/StockInService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  stockInCreateEditSchema,
  YupStockInCreateEdit,
} from "./yup/stockInCreateEditSchema";

const StockInCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = !!id;

  const stockInService = useStockInService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const formik = useFormik<YupStockInCreateEdit>({
    initialValues: {
      number: "",
      sellerInfo: "",
      purchaser: "",
      location: "",
      dateOfPurchase: new Date().toISOString().split("T")[0],
      warehouseId: EMPTY_GUID as guid,
      stockInItems: [],
    },
    validationSchema: stockInCreateEditSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await stockInService.updateStockIn(id!, values);
          notificationService.handleApiSuccessMessage(
            "stock-in",
            "updated",
            "common"
          );
        } else {
          await stockInService.createStockIn(values);
          notificationService.handleApiSuccessMessage(
            "stock-in",
            "created",
            "common"
          );
        }
        navigate("/stockin");
      } catch (error: any) {
        notificationService.handleApiErrorMessage(error.data, "common");
      }
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (isEdit && id) {
        try {
          const stockIn = await stockInService.getStockInById(id);
          formik.setValues({
            number: stockIn.number,
            sellerInfo: stockIn.sellerInfo,
            purchaser: stockIn.purchaser,
            location: stockIn.location,
            dateOfPurchase: new Date(stockIn.dateOfPurchase)
              .toISOString()
              .split("T")[0],
            warehouseId: stockIn.warehouseId,
            stockInItems:
              stockIn.stockInItems?.map((item) => ({
                productId: item.productId,
                locationId: item.locationId,
                primarySerialNumber: item.primarySerialNumber,
                manufactureSerialNumber: item.manufactureSerialNumber,
                region: item.region,
                condition: item.condition,
                retailSellingPrice: item.retailSellingPrice,
                dealerSellingPrice: item.dealerSellingPrice,
                agentSellingPrice: item.agentSellingPrice,
                cost: item.cost,
                remarks: item.remarks,
                itemsIncluded: item.itemsIncluded,
                receiveQuantity: item.receiveQuantity,
              })) || [],
          });
        } catch (error: any) {
          notificationService.handleApiErrorMessage(error.data, "common");
        }
      }
      setPageReady(true);
    };

    loadData();
  }, [id, isEdit, stockInService, formik, notificationService, navigate, t]);

  if (!pageReady) {
    return <div>Loading...</div>;
  }

  return (
    <Page
      title={isEdit ? t("edit-stock-in") : t("create-stock-in")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-in"), to: "/stockin" },
        { label: isEdit ? t("edit-stock-in") : t("create-stock-in") },
      ]}
    >
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <PbCard>
            <CardContent>
              <TextField
                fullWidth
                label={t("number")}
                name="number"
                value={formik.values.number}
                onChange={formik.handleChange}
                error={formik.touched.number && Boolean(formik.errors.number)}
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.number}
                    error={formik.errors.number}
                    translatedFieldName={t("number")}
                  />
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label={t("seller-info")}
                name="sellerInfo"
                value={formik.values.sellerInfo}
                onChange={formik.handleChange}
                error={
                  formik.touched.sellerInfo && Boolean(formik.errors.sellerInfo)
                }
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.sellerInfo}
                    error={formik.errors.sellerInfo}
                    translatedFieldName={t("seller-info")}
                  />
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label={t("purchaser")}
                name="purchaser"
                value={formik.values.purchaser}
                onChange={formik.handleChange}
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
                margin="normal"
              />
              <TextField
                fullWidth
                label={t("location")}
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={
                  <FormikErrorMessage
                    touched={formik.touched.location}
                    error={formik.errors.location}
                    translatedFieldName={t("location")}
                  />
                }
                margin="normal"
              />
              <TextField
                fullWidth
                type="date"
                label={t("date-of-purchase")}
                name="dateOfPurchase"
                value={formik.values.dateOfPurchase}
                onChange={formik.handleChange}
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
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default StockInCreateEditPage;
