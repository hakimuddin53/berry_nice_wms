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
import { CustomerDetailsDto } from "interfaces/v12/customer/customerDetails/customerDetailsDto";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
import { guid } from "types/guid";

function CustomerDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const CustomerService = useCustomerService();
  const [customer, setCustomer] = useState<CustomerDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const loadCustomer = useCallback(() => {
    CustomerService.getCustomerById(id as guid)
      .then((customer) => setCustomer(customer))
      .catch((err) => {});
  }, [CustomerService, id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer, id]);

  if (!customer) {
    return (
      <Page
        pagename={t("customer")}
        breadcrumbs={[]}
        title={t("customer-not-found")}
      ></Page>
    );
  }

  return (
    <Page
      title={t("customer")}
      subtitle={customer.name}
      showBackdrop={pageBlocker}
      hasSingleActionButton
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("customer"),
          to: `/customer`,
        },
        {
          label: customer.name,
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
        //         await CustomerService.deleteCustomer(customer.id);
        //       },
        //       setPageBlocker: setPageBlocker,
        //       entity: "customer",
        //       translationNamespace: "common",
        //       deleteDataName: customer.name,
        //       redirectLink: `/customer`,
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
                  <KeyValuePair label={t("customer-code")}>
                    <EasyCopy clipboard={customer.customerCode}>
                      {customer.customerCode}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("name")}>
                    <EasyCopy clipboard={customer.name}>
                      {customer.name}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("phone")}>
                    {customer.phone || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("email")}>
                    {customer.email || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("address")}>
                    {customer.address || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("customer-type")}>
                    {customer.customerTypeLabel || customer.customerTypeId}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={customer.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={customer.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={customer.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={customer.changedById} placeholder="-" />
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

export default CustomerDetailsPage;
