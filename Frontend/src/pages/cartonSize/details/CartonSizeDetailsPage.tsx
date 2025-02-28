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
import { CartonSizeDetailsDto } from "interfaces/v12/cartonSize/cartonSize";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useCartonSizeService } from "services/CartonSizeService";
import { guid } from "types/guid";

function CartonSizeDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const CartonSizeService = useCartonSizeService();
  const [cartonSize, setCartonSize] = useState<CartonSizeDetailsDto | null>(
    null
  );

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    CartonSizeService.getCartonSizeById(id as guid)
      .then((cartonSize) => setCartonSize(cartonSize))
      .catch((err) => {});
  }, [CartonSizeService, id]);

  if (!cartonSize) {
    return (
      <Page
        pagename={t("cartonSize")}
        breadcrumbs={[]}
        title={"Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("cartonSize")}
      subtitle={cartonSize.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("cartonSize"),
          to: `/cartonSize`,
        },
        {
          label: cartonSize.id,
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
                await CartonSizeService.deleteCartonSize(cartonSize.id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "cartonSize",
              translationNamespace: "common",
              redirectLink: `/cartonSizes`,
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
                <EasyCopy clipboard={cartonSize.name}>
                  {cartonSize.name}
                </EasyCopy>
              </KeyValuePair>

              <KeyValuePair label={t("created-at")}>
                <UserDateTime date={cartonSize.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("changed-at")}>
                <UserDateTime date={cartonSize.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("created-by")}>
                <UserName userId={cartonSize.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("changed-by")}>
                <UserName userId={cartonSize.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default CartonSizeDetailsPage;
