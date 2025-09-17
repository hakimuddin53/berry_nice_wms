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
import UserDateTime from "components/platbricks/shared/UserDateTime";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import { SupplierDetailsDto } from "interfaces/v12/supplier/supplierDetails/supplierDetailsDto";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSupplierService } from "services/SupplierService";
import { guid } from "types/guid";

function SupplierDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const SupplierService = useSupplierService();
  const [supplier, setSupplier] = useState<SupplierDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const loadSupplier = useCallback(() => {
    SupplierService.getSupplierById(id as guid)
      .then((supplier) => setSupplier(supplier))
      .catch((err) => {});
  }, [SupplierService, id]);

  useEffect(() => {
    loadSupplier();
  }, [loadSupplier, id]);

  if (!supplier) {
    return (
      <Page
        pagename={t("supplier")}
        breadcrumbs={[]}
        title={"Supplier Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("supplier")}
      subtitle={supplier.name}
      showBackdrop={pageBlocker}
      hasSingleActionButton
      breadcrumbs={[
        {
          label: t("dashboard"),
          to: "/",
        },
        {
          label: t("supplier"),
          to: `/supplier`,
        },
        {
          label: supplier.name,
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
        //         await SupplierService.deleteSupplier(supplier.id);
        //       },
        //       setPageBlocker: setPageBlocker,
        //       entity: "supplier",
        //       translationNamespace: "common",
        //       deleteDataName: supplier.name,
        //       redirectLink: `/supplier`,
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
                  <KeyValuePair label={t("supplier-code")}>
                    <EasyCopy clipboard={supplier.supplierCode}>
                      {supplier.supplierCode}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("name")}>
                    <EasyCopy clipboard={supplier.name}>
                      {supplier.name}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("ic")}>
                    {supplier.ic || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("tax-id")}>
                    {supplier.taxId || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("address1")}>
                    {supplier.address1 || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("address2")}>
                    {supplier.address2 || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("address3")}>
                    {supplier.address3 || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("address4")}>
                    {supplier.address4 || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("contact-no")}>
                    {supplier.contactNo || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("email")}>
                    {supplier.email || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={supplier.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={supplier.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={supplier.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={supplier.changedById} placeholder="-" />
                  </KeyValuePair>
                </KeyValueList>
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

export default SupplierDetailsPage;
