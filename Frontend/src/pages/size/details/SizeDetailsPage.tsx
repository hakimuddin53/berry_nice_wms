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
import { SizeDetailsDto } from "interfaces/v12/size/size";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSizeService } from "services/SizeService";
import { guid } from "types/guid";

function SizeDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const SizeService = useSizeService();
  const [size, setSize] = useState<SizeDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    SizeService.getSizeById(id as guid)
      .then((size) => setSize(size))
      .catch((err) => {});
  }, [SizeService, id]);

  if (!size) {
    return (
      <Page pagename={t("size")} breadcrumbs={[]} title={"Not Found"}></Page>
    );
  }

  return (
    <Page
      title={t("size")}
      subtitle={size.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("sizes"),
          to: `/size`,
        },
        {
          label: size.id,
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
                await SizeService.deleteSize(size.id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "size",
              translationNamespace: "common",
              redirectLink: `/sizes`,
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
                <EasyCopy clipboard={size.name}>{size.name}</EasyCopy>
              </KeyValuePair>

              <KeyValuePair label={t("created-at")}>
                <UserDateTime date={size.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("changed-at")}>
                <UserDateTime date={size.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("created-by")}>
                <UserName userId={size.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("changed-by")}>
                <UserName userId={size.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default SizeDetailsPage;
