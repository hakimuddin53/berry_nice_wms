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
import { ColourDetailsDto } from "interfaces/v12/colour/colour";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useColourService } from "services/ColourService";
import { guid } from "types/guid";

function ColourDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const ColourService = useColourService();
  const [colour, setColour] = useState<ColourDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    ColourService.getColourById(id as guid)
      .then((colour) => setColour(colour))
      .catch((err) => {});
  }, [ColourService, id]);

  if (!colour) {
    return (
      <Page pagename={t("colour")} breadcrumbs={[]} title={"Not Found"}></Page>
    );
  }

  return (
    <Page
      title={t("colour")}
      subtitle={colour.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("colours"),
          to: `/colour`,
        },
        {
          label: colour.id,
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
                await ColourService.deleteColour(colour.id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "colour",
              translationNamespace: "common",
              redirectLink: `/colours`,
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
              <KeyValuePair label={t("name")}>
                <EasyCopy clipboard={colour.name}>{colour.name}</EasyCopy>
              </KeyValuePair>

              <KeyValuePair label={t("created-at")}>
                <UserDateTime date={colour.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("changed-at")}>
                <UserDateTime date={colour.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("created-by")}>
                <UserName userId={colour.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("changed-by")}>
                <UserName userId={colour.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default ColourDetailsPage;
