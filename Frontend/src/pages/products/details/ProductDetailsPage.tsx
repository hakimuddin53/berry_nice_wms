import { CardContent, Grid, Typography } from "@mui/material";
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

function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const [product, setProduct] = useState<ProductDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const loadProduct = useCallback(() => {
    ProductService.getProductById(id!)
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
        title={t("product-not-found")}
      ></Page>
    );
  }

  return (
    <Page
      title={t("product")}
      subtitle={product.productCode}
      showBackdrop={pageBlocker}
      hasSingleActionButton
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("product"),
          to: `/product`,
        },
        {
          label: product.productCode,
        },
      ]}
      actions={[
        {
          title: t("common:edit"),
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
          <PbTab label={t("common:details")} />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <Grid container rowSpacing={100}>
              <Grid item xs={6}>
                <KeyValueList gridTemplateColumns="2fr 4fr">
                  <KeyValuePair label={t("productCode")}>
                    <EasyCopy clipboard={product.productCode}>
                      {product.productCode}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("category")}>
                    {product.category}
                  </KeyValuePair>
                  <KeyValuePair label={t("brand")}>
                    {product.brand}
                  </KeyValuePair>
                  <KeyValuePair label={t("model")}>
                    {product.model}
                  </KeyValuePair>
                  <KeyValuePair label={t("color")}>
                    {product.color}
                  </KeyValuePair>
                  <KeyValuePair label={t("storage")}>
                    {product.storage}
                  </KeyValuePair>
                  <KeyValuePair label={t("ram")}>{product.ram}</KeyValuePair>
                  <KeyValuePair label={t("processor")}>
                    {product.processor}
                  </KeyValuePair>
                  <KeyValuePair label={t("screenSize")}>
                    {product.screenSize}
                  </KeyValuePair>
                  <KeyValuePair label={t("lowQty")}>
                    {product.lowQty}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={product.createdDate} />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
              <Grid item xs={6}>
                <QRCodeGenerator serialNumber={product.productCode} />
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
