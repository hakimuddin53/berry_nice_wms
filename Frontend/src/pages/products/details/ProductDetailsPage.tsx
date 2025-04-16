import { CardContent, Grid, Typography } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import {
  EasyCopy,
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import QRCodeGenerator from "components/platbricks/shared/QrCodeGenerator";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useProductService } from "services/ProductService";
import { guid } from "types/guid";

function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const [product, setProduct] = useState<ProductDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const loadProduct = useCallback(() => {
    ProductService.getProductById(id as guid)
      .then((product) => setProduct(product))
      .catch((err) => {});
  }, [ProductService, id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct, id]);

  if (!product) {
    return (
      <Page
        pagename={t("product")}
        breadcrumbs={[]}
        title={"Stock Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("product")}
      subtitle={product.name}
      showBackdrop={pageBlocker}
      hasSingleActionButton
      breadcrumbs={[
        {
          label: t("dashboard"),
          to: "/",
        },
        {
          label: t("product"),
          to: `/product`,
        },
        {
          label: product.name,
        },
      ]}
      actions={[
        {
          title: t("edit"),
          to: "edit",
          icon: "Edit",
        },
        // {
        //   title: t("delete"),
        //   icon: "Delete",
        //   onclick: () => {
        //     OpenDeleteConfirmationDialog({
        //       onConfirmDeletion: async () => {
        //         await ProductService.deleteProduct(product.id);
        //       },
        //       setPageBlocker: setPageBlocker,
        //       entity: "product",
        //       translationNamespace: "common",
        //       deleteDataName: product.name,
        //       redirectLink: `/product`,
        //     });
        //   },
        // },
      ]}
    >
      <PbCard px={2} pt={2}>
        <PbTabs
          value={tab}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
        >
          <PbTab label={t("details")} />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <Grid container rowSpacing={100}>
              <Grid item xs={6}>
                <KeyValueList gridTemplateColumns="2fr 4fr">
                  <KeyValuePair label={t("name")}>
                    <EasyCopy clipboard={product.name}>{product.name}</EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("serial-number")}>
                    <EasyCopy clipboard={product.serialNumber}>
                      {product.serialNumber}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("item-code")}>
                    {product.itemCode}
                  </KeyValuePair>
                  <KeyValuePair label={t("clientCode")}>
                    {product.clientCodeString}
                  </KeyValuePair>
                  <KeyValuePair label={t("carton-size")}>
                    {product.cartonSize}
                  </KeyValuePair>
                  <KeyValuePair label={t("category")}>
                    {product.category}
                  </KeyValuePair>
                  <KeyValuePair label={t("colour")}>
                    {product.colour}
                  </KeyValuePair>
                  <KeyValuePair label={t("size")}>{product.size}</KeyValuePair>
                  <KeyValuePair label={t("design")}>
                    {product.design}
                  </KeyValuePair>
                  <KeyValuePair label={t("list-price")}>
                    {product.listPrice}
                  </KeyValuePair>
                  <KeyValuePair label={t("quantityPerCarton")}>
                    {product.quantityPerCarton}
                  </KeyValuePair>
                  <KeyValuePair label={t("threshold")}>
                    {product.threshold}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={product.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={product.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={product.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={product.changedById} placeholder="-" />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
              <Grid item xs={6}>
                <QRCodeGenerator serialNumber={product.serialNumber} />
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>

          <PbTabPanel value={tab} index={10}>
            <Typography variant="subtitle2" gutterBottom display="inline">
              {t("feature-unavailable")}
            </Typography>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default ProductDetailsPage;
