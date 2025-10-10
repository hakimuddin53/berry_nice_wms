import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useProductTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const productData = useMemo<DataTableHeaderCell<ProductDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("stock-in-id"),
        hidden,
      },
      {
        id: "productCode",
        label: t("productCode"),
        render: (row) => (
          <EasyCopy clipboard={row.productCode}>
            <Link component={NavLink} to={`/product/${row.productId}`}>
              {row.productCode || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "category",
        label: t("category"),
      },
      {
        id: "brand",
        label: t("brand"),
      },
      {
        id: "model",
        label: t("model"),
      },
      {
        id: "color",
        label: t("color"),
      },
      {
        id: "storage",
        label: t("storage"),
      },
      {
        id: "ram",
        label: t("ram"),
      },
      {
        id: "processor",
        label: t("processor"),
      },
      {
        id: "screenSize",
        label: t("screenSize"),
      },
      {
        id: "lowQty",
        label: t("lowQty"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(productData);
  return [productData];
};
