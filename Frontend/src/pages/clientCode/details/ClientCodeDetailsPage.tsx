import { CardContent } from "@mui/material";
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
import { ClientCodeDetailsDto } from "interfaces/v12/clientCode/clientCode";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useClientCodeService } from "services/ClientCodeService";
import { guid } from "types/guid";

function ClientCodeDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const ClientCodeService = useClientCodeService();
  const [clientCode, setClientCode] = useState<ClientCodeDetailsDto | null>(
    null
  );

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    ClientCodeService.getClientCodeById(id as guid)
      .then((clientCode) => setClientCode(clientCode))
      .catch((err) => {});
  }, [ClientCodeService, id]);

  if (!clientCode) {
    return (
      <Page
        pagename={t("clientCode")}
        breadcrumbs={[]}
        title={"Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("clientCode")}
      subtitle={clientCode.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("clientCodes"),
          to: `/client-code`,
        },
        {
          label: clientCode.id,
        },
      ]}
      actions={[
        {
          title: t("common:edit"),
          to: "edit",
          icon: "Edit",
        },
        {
          title: t("common:delete"),
          icon: "Delete",
          onclick: () => {
            OpenDeleteConfirmationDialog({
              onConfirmDeletion: async () => {
                await ClientCodeService.deleteClientCode(clientCode.id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "clientCode",
              translationNamespace: "common",
              redirectLink: `/clientCode`,
            });
          },
        },
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
            <KeyValueList gridTemplateColumns="2fr 4fr">
              <KeyValuePair label={t("code")}>
                <EasyCopy clipboard={clientCode.name}>
                  {clientCode.name}
                </EasyCopy>
              </KeyValuePair>

              <KeyValuePair label={t("created-at")}>
                <UserDateTime date={clientCode.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("changed-at")}>
                <UserDateTime date={clientCode.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("created-by")}>
                <UserName userId={clientCode.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("changed-by")}>
                <UserName userId={clientCode.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default ClientCodeDetailsPage;
