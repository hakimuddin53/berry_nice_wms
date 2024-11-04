import { CardContent, Chip } from "@mui/material";
import {
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
import { EventActionTypeEnum } from "interfaces/enums/EventSettingEnums";
import { EventSettingDetailsV12Dto } from "interfaces/v12/eventSetting/eventSettingDetails/eventSettingDetailsV12Dto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useEventSettingService } from "services/EventSettingService";
import { guid } from "types/guid";

function EventSettingDetailsPage() {
  const { t } = useTranslation("eventSetting");
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const EventSettingService = useEventSettingService();
  const [eventSetting, setEventSetting] =
    useState<EventSettingDetailsV12Dto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    EventSettingService.getEventSettingById(id as guid)
      .then((eventSetting) => {
        setEventSetting(eventSetting);
      })
      .catch((err) => {
        // updateResponseStatus(err);
      });
  }, [EventSettingService, id]);

  if (!eventSetting) {
    return (
      <Page pagename={t("event-setting")} breadcrumbs={[]} title={""}></Page>
    );
  }

  return (
    <Page
      title={t("event-setting")}
      subtitle={eventSetting.event}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("event-settings"),
          to: `/event-settings`,
        },
        {
          label: eventSetting.event,
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
          onclick: () => {
            OpenDeleteConfirmationDialog({
              onConfirmDeletion: async () => {
                await EventSettingService.deleteEventSetting(id as guid);
              },
              setPageBlocker: setPageBlocker,
              entity: "event-setting",
              translationNamespace: "eventSetting",
              redirectLink: "event-settings",
            });
          },
          icon: "Delete",
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
            <KeyValueList>
              <KeyValuePair label={t("event")}>
                {t(eventSetting.event, { ns: "enumerables" })}
              </KeyValuePair>

              <KeyValuePair label={t("common:sequence")}>
                {eventSetting.sequence}
              </KeyValuePair>
              <KeyValuePair label={t("action")}>
                {eventSetting.actionType}
              </KeyValuePair>
              {eventSetting.actionType ===
                EventActionTypeEnum.BUSINESS_LOGIC && (
                <KeyValuePair label={t("business-logic")}>
                  {eventSetting.businessLogic}
                </KeyValuePair>
              )}
              {(eventSetting.actionType === EventActionTypeEnum.CALLBACK ||
                eventSetting.actionType ===
                  EventActionTypeEnum.BUSINESS_LOGIC) && (
                <KeyValuePair label={t("callback-url")}>
                  {eventSetting.callbackUrl}
                </KeyValuePair>
              )}
              {(eventSetting.actionType === EventActionTypeEnum.EMAIL ||
                eventSetting.actionType ===
                  EventActionTypeEnum.BUSINESS_LOGIC) && (
                <KeyValuePair label={t("common:email")}>
                  {eventSetting.email &&
                    eventSetting.email
                      .split(";")
                      .map((label, index) => (
                        <Chip
                          key={index}
                          label={label}
                          sx={{ mr: 1 }}
                          style={{ height: "auto" }}
                          size="small"
                          color="default"
                        />
                      ))}
                </KeyValuePair>
              )}
              {(eventSetting.actionType === EventActionTypeEnum.EMAIL ||
                eventSetting.actionType ===
                  EventActionTypeEnum.BUSINESS_LOGIC) && (
                <KeyValuePair label={t("email-language")}>
                  {eventSetting.emailLanguage}
                </KeyValuePair>
              )}
              {eventSetting.actionType ===
                EventActionTypeEnum.BUSINESS_LOGIC && (
                <KeyValuePair label={t("parameter-1")}>
                  {eventSetting.parameter1}
                </KeyValuePair>
              )}
              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={eventSetting.createdAt} />
              </KeyValuePair>

              <KeyValuePair label={t("common:changed-at")}>
                <UserDateTime date={eventSetting.changedAt} />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default EventSettingDetailsPage;
