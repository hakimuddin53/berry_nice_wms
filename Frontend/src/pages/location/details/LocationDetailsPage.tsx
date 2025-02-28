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
import { LocationDetailsDto } from "interfaces/v12/location/location";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useLocationService } from "services/LocationService";
import { guid } from "types/guid";

function LocationDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const LocationService = useLocationService();
  const [location, setLocation] = useState<LocationDetailsDto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    LocationService.getLocationById(id as guid)
      .then((location) => setLocation(location))
      .catch((err) => {});
  }, [LocationService, id]);

  if (!location) {
    return (
      <Page
        pagename={t("location")}
        breadcrumbs={[]}
        title={"Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("location")}
      subtitle={location.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("locations"),
          to: `/location`,
        },
        {
          label: location.id,
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
                await LocationService.deleteLocation(location.id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "location",
              translationNamespace: "common",
              redirectLink: `/locations`,
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
                <EasyCopy clipboard={location.name}>{location.name}</EasyCopy>
              </KeyValuePair>

              <KeyValuePair label={t("created-at")}>
                <UserDateTime date={location.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("changed-at")}>
                <UserDateTime date={location.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("created-by")}>
                <UserName userId={location.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("changed-by")}>
                <UserName userId={location.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default LocationDetailsPage;
