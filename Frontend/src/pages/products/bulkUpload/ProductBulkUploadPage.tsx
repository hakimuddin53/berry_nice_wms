import { Button, CardContent, TextField } from "@mui/material";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useProductService } from "services/ProductService";
import * as XLSX from "xlsx";

const ProductBulkUploadPage: React.FC = () => {
  const { t } = useTranslation();
  const ProductService = useProductService();
  const notificationService = useNotificationService();
  const [file, setFile] = useState<File | null>(null);
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const validateFile = async (file: File): Promise<boolean> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const requiredColumns = [
      "Name",
      "ItemCode",
      "ClientCode",
      "StockGroup",
      "InboundQuantity",
      "Category",
      "Colour",
      "Design",
      "Size",
      "ListPrice",
      "QuantityPerCarton",
      "Threshold",
    ];

    const headers = jsonData[0] as string[];
    console.log(headers);

    for (const column of requiredColumns) {
      if (!headers.includes(column)) {
        console.error(`Missing column: ${column}`);
        notificationService.handleErrorMessage(
          t("common:missing-column", { column })
        );
        return false;
      }
    }

    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      notificationService.handleErrorMessage(t("common:please-select-a-file"));
      return;
    }

    const isValid = await validateFile(file);
    if (!isValid) {
      return;
    }

    setPageBlocker(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await ProductService.bulkUploadProducts(formData);
      notificationService.handleApiSuccessMessage(
        "product",
        "uploaded",
        "product"
      );
      setTimeout(() => {
        navigate(`/product}`);
      }, 100);
    } catch (error) {
      //notificationService.handleApiErrorMessage(error.data, "product");
    } finally {
      setPageBlocker(false);
    }
  };

  return (
    <Page
      title={t("bulk-upload-products")}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("product"), to: "/product" },
        { label: t("bulk-upload") },
      ]}
    >
      <PbCard px={2} pt={2}>
        <CardContent>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            inputProps={{ accept: ".csv, .xlsx" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
            style={{ marginTop: "16px" }}
          >
            {t("upload")}
          </Button>
        </CardContent>
      </PbCard>
    </Page>
  );
};

export default ProductBulkUploadPage;
