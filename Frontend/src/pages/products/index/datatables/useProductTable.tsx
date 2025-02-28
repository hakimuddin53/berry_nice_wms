import { Chip, Link } from "@mui/material";
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
        id: "name",
        label: t("common:name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/product/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "serialNumber",
        label: t("serial-number"),
      },
      {
        id: "itemCode",
        label: t("itemCode"),
      },
      {
        id: "clientCodeString",
        label: t("clientCode"),
        render: (row) => (
          <Chip size="small" label={t(row.clientCodeString)} color="default" />
        ),
      },
      {
        id: "cartonSize",
        label: t("carton-size"),
      },
      {
        id: "category",
        label: t("category"),
      },
      {
        id: "colour",
        label: t("colour"),
      },
      {
        id: "size",
        label: t("size"),
      },
      {
        id: "design",
        label: t("design"),
      },
      {
        id: "listPrice",
        label: t("list-price"),
      },
      {
        id: "quantityPerCarton",
        label: t("quantityPerCarton"),
      },
      {
        id: "threshold",
        label: t("threshold"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(productData);
  return [productData];
};
