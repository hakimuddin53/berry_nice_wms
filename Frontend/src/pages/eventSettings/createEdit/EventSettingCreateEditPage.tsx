import {
  Autocomplete,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  DataList,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { FormikProvider, useFormik } from "formik";
import {
  AllActionTypesSupportedEvents,
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEventSettingService } from "services/EventSettingService";
import { useNotificationService } from "services/NotificationService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  YupEventSettingCreateEdit,
  eventSettingCreateEditShema,
} from "./yup/eventSettingCreateEditShema";

const EventSettingCreateEditPage: React.FC = () => {
  const { t } = useTranslation("eventSetting");
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const EventSettingService = useEventSettingService();

  const [eventSetting, setEventSetting] = useState<YupEventSettingCreateEdit>({
    event: EventTypeEnum.UNSPECIFIED,
    locationId: "",
    actionType: EventActionTypeEnum.BUSINESS_LOGIC,
    callbackUrl: "",
    emails: [],
    email: "",
    emailLanguage: "",
    businessLogic: "",
    sequence: 0,
    parameter1: "",
  });

  const notificationService = useNotificationService();
  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();

  const [allowedActionType, setAllowedActionType] = useState(
    Object.values(EventActionTypeEnum)
  );

  let title = t("create-event-setting");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    { label: t("event-settings"), to: "/event-settings" },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("event-setting");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      { label: t("event-settings"), to: "/event-settings" },
      { label: eventSetting.event, to: "/event-settings/" + id },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: eventSetting,
    validationSchema: eventSettingCreateEditShema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        EventSettingService.createEventSetting(values)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "event-setting",
              "created",
              "eventSetting"
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "eventSetting");
          });
      } else {
        EventSettingService.updateEventSetting(id as guid, values)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "event-setting",
              "updated",
              "eventSetting"
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "eventSetting");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  const selectActionTypeChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("actionType", event.target.value);
    formik.setFieldValue("businessLogic", "");
    formik.setFieldValue("callbackUrl", "");
    formik.setFieldValue("emails", "");
    formik.setFieldValue("emailLanguage", "");
    formik.setFieldValue("parameter1", "");
  };

  useEffect(() => {
    if (id) {
      EventSettingService.getEventSettingById(id as guid)
        .then((eventSetting: any) => {
          eventSetting.locationId = eventSetting.locationId ?? "";
          eventSetting.callbackUrl = eventSetting.callbackUrl ?? "";
          eventSetting.emails = eventSetting.email
            ? eventSetting.email.split(";")
            : [];
          eventSetting.email = eventSetting.email ?? "";
          eventSetting.emailLanguage = eventSetting.emailLanguage ?? "";
          eventSetting.businessLogic = eventSetting.businessLogic ?? "";
          eventSetting.parameter1 = eventSetting.parameter1 ?? "";
          setEventSetting(eventSetting);
          setPageReady(true);
        })
        .catch((err) => {
          // updateResponseStatus(err);
        });
    } else {
      setPageReady(true);
    }
  }, [id, EventSettingService]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      notificationService.handleErrorMessage(
        t("common:please-fix-the-errors-and-try-again")
      );
    }
  }, [
    formik.submitCount,
    notificationService,
    formik.isSubmitting,
    formik.isValid,
    t,
  ]);

  useEffect(() => {
    AllActionTypesSupportedEvents.indexOf(formik.values.event) > -1
      ? setAllowedActionType(Object.values(EventActionTypeEnum))
      : setAllowedActionType(
          Object.values(EventActionTypeEnum).filter(
            (x) => x === EventActionTypeEnum.BUSINESS_LOGIC
          )
        );
  }, [formik.values.event]);

  const navigateToDetails = (id: string | undefined) => {
    if (id) {
      setTimeout(() => {
        navigate(`/event-settings/${id}`);
      }, 100);
    }
  };

  return (
    <Page
      title={title}
      subtitle={id ? eventSetting.event : ""}
      breadcrumbs={breadcrumbs}
      showLoading={!pageReady}
      showBackdrop={pageBlocker}
      actions={[
        {
          title: t("common:save"),
          onclick: formik.handleSubmit,
          icon: "Save",
        },
      ]}
      hasSingleActionButton={true}
    >
      <NavBlocker when={formik.dirty}></NavBlocker>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <PbCard px={2} pt={2}>
            <PbTabs
              value={tab}
              onChange={(event: React.SyntheticEvent, newValue: number) => {
                setTab(newValue);
              }}
            >
              <PbTab label={t("common:details")} />
              {formik.values.actionType ===
                EventActionTypeEnum.BUSINESS_LOGIC && (
                <PbTab label={t("common:advanced")} />
              )}
            </PbTabs>
            <CardContent>
              <PbTabPanel value={tab} index={0}>
                <DataList
                  hideDevider={true}
                  data={[
                    {
                      label: t("event"),
                      required: isRequiredField(
                        eventSettingCreateEditShema,
                        "event",
                        formik.values
                      ),
                      value: (
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.event && Boolean(formik.errors.event)
                          }
                        >
                          <Autocomplete
                            id="event"
                            size="small"
                            disableClearable={true}
                            value={formik.values.event}
                            options={Object.values(EventTypeEnum).sort()}
                            getOptionLabel={(option) =>
                              `${t(option, { ns: "enumerables" })}`
                            }
                            onChange={(event: any, value: EventTypeEnum) => {
                              formik.setFieldValue("event", value);
                              if (
                                AllActionTypesSupportedEvents.indexOf(value) ===
                                -1
                              ) {
                                formik.setFieldValue(
                                  "actionType",
                                  EventActionTypeEnum.BUSINESS_LOGIC
                                );
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.event &&
                                  Boolean(formik.errors.event)
                                }
                              />
                            )}
                          />
                          <FormHelperText>
                            {formik.touched.event && formik.errors.event
                              ? t(formik.errors.event)
                              : ""}
                          </FormHelperText>
                        </FormControl>
                      ),
                    },

                    {
                      label: t("action"),
                      required: isRequiredField(
                        eventSettingCreateEditShema,
                        "actionType",
                        formik.values
                      ),
                      value: (
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.actionType &&
                            Boolean(formik.errors.actionType)
                          }
                        >
                          <Select
                            id="actionType"
                            name="actionType"
                            size="small"
                            value={formik.values.actionType}
                            onChange={selectActionTypeChange}
                            onBlur={formik.handleBlur}
                          >
                            {allowedActionType.map((p) => (
                              <MenuItem value={p} key={p}>
                                {t(p, { ns: "enumerables" })}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            <FormikErrorMessage
                              touched={formik.touched.actionType}
                              error={formik.errors.actionType}
                              translatedFieldName={t("action")}
                            />
                          </FormHelperText>
                        </FormControl>
                      ),
                    },
                    {
                      label: t("common:sequence"),
                      required: isRequiredField(
                        eventSettingCreateEditShema,
                        "sequence",
                        formik.values
                      ),
                      value: (
                        <TextField
                          fullWidth
                          id="sequence"
                          name="sequence"
                          size="small"
                          value={formik.values.sequence}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.sequence &&
                            Boolean(formik.errors.sequence)
                          }
                          helperText={
                            <FormikErrorMessage
                              touched={formik.touched.sequence}
                              error={formik.errors.sequence}
                              translatedFieldName={t("common:sequence")}
                            />
                          }
                        />
                      ),
                    },
                    ...(formik.values.actionType ===
                    EventActionTypeEnum.BUSINESS_LOGIC
                      ? [
                          {
                            label: t("business-logic"),
                            required: isRequiredField(
                              eventSettingCreateEditShema,
                              "businessLogic",
                              formik.values
                            ),
                            value: (
                              <TextField
                                fullWidth
                                id="businessLogic"
                                name="businessLogic"
                                size="small"
                                value={formik.values.businessLogic}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.businessLogic &&
                                  Boolean(formik.errors.businessLogic)
                                }
                                helperText={
                                  <FormikErrorMessage
                                    touched={formik.touched.businessLogic}
                                    error={formik.errors.businessLogic}
                                    translatedFieldName={t("business-logic")}
                                  />
                                }
                              />
                            ),
                          },
                        ]
                      : []),
                    ...(formik.values.actionType ===
                    EventActionTypeEnum.CALLBACK
                      ? [
                          {
                            label: t("callback-url"),
                            required: isRequiredField(
                              eventSettingCreateEditShema,
                              "callbackUrl",
                              formik.values
                            ),
                            value: (
                              <TextField
                                fullWidth
                                id="callbackUrl"
                                name="callbackUrl"
                                size="small"
                                value={formik.values.callbackUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.callbackUrl &&
                                  Boolean(formik.errors.callbackUrl)
                                }
                                helperText={
                                  <FormikErrorMessage
                                    touched={formik.touched.callbackUrl}
                                    error={formik.errors.callbackUrl}
                                    translatedFieldName={t("callback-url")}
                                  />
                                }
                              />
                            ),
                          },
                        ]
                      : []),
                    ...(formik.values.actionType === EventActionTypeEnum.EMAIL
                      ? [
                          {
                            label: t("common:email"),
                            required: isRequiredField(
                              eventSettingCreateEditShema,
                              "email",
                              formik.values
                            ),
                            value: (
                              <FormControl
                                fullWidth
                                error={
                                  formik.touched.emails &&
                                  Boolean(formik.errors.emails)
                                }
                              >
                                <Autocomplete
                                  multiple
                                  options={[]}
                                  freeSolo
                                  value={formik.values.emails}
                                  clearOnBlur={true}
                                  disableClearable={true}
                                  onChange={(event: any, value: any[]) => {
                                    formik.setFieldValue("emails", value);
                                    formik.setFieldValue(
                                      "email",
                                      value.join(";")
                                    );
                                  }}
                                  renderTags={(value, getTagProps) =>
                                    value.map((label, index) => (
                                      <Chip
                                        label={label}
                                        {...getTagProps({ index })}
                                      />
                                    ))
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      onBlur={(
                                        e: React.FocusEvent<HTMLInputElement>
                                      ) => {
                                        formik.setFieldTouched("emails");
                                        if (e.target.value) {
                                          let newValue = [e.target.value];
                                          if (formik.values.emails) {
                                            newValue = [
                                              ...formik.values.emails,
                                              e.target.value,
                                            ];
                                          }
                                          formik.setFieldValue(
                                            "emails",
                                            newValue
                                          );
                                          formik.setFieldValue(
                                            "email",
                                            newValue.join(";")
                                          );
                                        }
                                      }}
                                      error={
                                        formik.touched.emails &&
                                        Boolean(formik.errors.emails)
                                      }
                                    />
                                  )}
                                />
                                <FormHelperText>
                                  <FormikErrorMessage
                                    touched={formik.touched.emails}
                                    error={formik.errors.emails}
                                    translatedFieldName={t("common:email")}
                                  />
                                </FormHelperText>
                              </FormControl>
                            ),
                          },
                        ]
                      : []),
                    ...(formik.values.actionType === EventActionTypeEnum.EMAIL
                      ? [
                          {
                            label: t("email-language"),
                            required: isRequiredField(
                              eventSettingCreateEditShema,
                              "emailLanguage",
                              formik.values
                            ),
                            value: (
                              <FormControl
                                fullWidth
                                error={
                                  formik.touched.emailLanguage &&
                                  Boolean(formik.errors.emailLanguage)
                                }
                              >
                                <Select
                                  id="emailLanguage"
                                  name="emailLanguage"
                                  size="small"
                                  value={formik.values.emailLanguage}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <MenuItem value="en-GB" key="en-GB">
                                    {t("english-gb", { ns: "auth" })}
                                  </MenuItem>
                                </Select>
                                <FormHelperText>
                                  <FormikErrorMessage
                                    touched={formik.touched.emailLanguage}
                                    error={formik.errors.emailLanguage}
                                    translatedFieldName={t("email-language")}
                                  />
                                </FormHelperText>
                              </FormControl>
                            ),
                          },
                        ]
                      : []),
                  ]}
                ></DataList>
              </PbTabPanel>
              {formik.values.actionType ===
                EventActionTypeEnum.BUSINESS_LOGIC && (
                <PbTabPanel value={tab} index={1}>
                  <DataList
                    hideDevider={true}
                    data={[
                      ...(formik.values.actionType ===
                      EventActionTypeEnum.BUSINESS_LOGIC
                        ? [
                            {
                              label: t("parameter-1"),
                              required: isRequiredField(
                                eventSettingCreateEditShema,
                                "parameter1",
                                formik.values
                              ),
                              value: (
                                <TextField
                                  fullWidth
                                  id="parameter1"
                                  name="parameter1"
                                  size="small"
                                  value={formik.values.parameter1}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.parameter1 &&
                                    Boolean(formik.errors.parameter1)
                                  }
                                  helperText={
                                    <FormikErrorMessage
                                      touched={formik.touched.parameter1}
                                      error={formik.errors.parameter1}
                                      translatedFieldName={t("parameter-1")}
                                    />
                                  }
                                />
                              ),
                            },
                          ]
                        : []),
                      ...(formik.values.actionType ===
                      EventActionTypeEnum.BUSINESS_LOGIC
                        ? [
                            {
                              label: t("callback-url"),
                              required: isRequiredField(
                                eventSettingCreateEditShema,
                                "callbackUrl",
                                formik.values
                              ),
                              value: (
                                <TextField
                                  fullWidth
                                  id="callbackUrl"
                                  name="callbackUrl"
                                  size="small"
                                  value={formik.values.callbackUrl}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.callbackUrl &&
                                    Boolean(formik.errors.callbackUrl)
                                  }
                                  helperText={
                                    <FormikErrorMessage
                                      touched={formik.touched.callbackUrl}
                                      error={formik.errors.callbackUrl}
                                      translatedFieldName={t("callback-url")}
                                    />
                                  }
                                />
                              ),
                            },
                          ]
                        : []),
                      ...(formik.values.actionType ===
                      EventActionTypeEnum.BUSINESS_LOGIC
                        ? [
                            {
                              label: t("common:email"),
                              required: isRequiredField(
                                eventSettingCreateEditShema,
                                "email",
                                formik.values
                              ),
                              value: (
                                <FormControl
                                  fullWidth
                                  error={
                                    formik.touched.emails &&
                                    Boolean(formik.errors.emails)
                                  }
                                >
                                  <Autocomplete
                                    multiple
                                    options={[]}
                                    freeSolo
                                    value={formik.values.emails}
                                    clearOnBlur={true}
                                    disableClearable={true}
                                    onChange={(event: any, value: any[]) => {
                                      formik.setFieldValue("emails", value);
                                      formik.setFieldValue(
                                        "email",
                                        value.join(";")
                                      );
                                    }}
                                    renderTags={(value, getTagProps) =>
                                      value.map((label, index) => (
                                        <Chip
                                          label={label}
                                          {...getTagProps({ index })}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        onBlur={(
                                          e: React.FocusEvent<HTMLInputElement>
                                        ) => {
                                          formik.setFieldTouched("emails");
                                          if (e.target.value) {
                                            let newValue = [e.target.value];
                                            if (formik.values.emails) {
                                              newValue = [
                                                ...formik.values.emails,
                                                e.target.value,
                                              ];
                                            }
                                            formik.setFieldValue(
                                              "emails",
                                              newValue
                                            );
                                            formik.setFieldValue(
                                              "email",
                                              newValue.join(";")
                                            );
                                          }
                                        }}
                                        error={
                                          formik.touched.emails &&
                                          Boolean(formik.errors.emails)
                                        }
                                      />
                                    )}
                                  />
                                  <FormHelperText>
                                    <FormikErrorMessage
                                      touched={formik.touched.emails}
                                      error={formik.errors.emails}
                                      translatedFieldName={t("common:email")}
                                    />
                                  </FormHelperText>
                                </FormControl>
                              ),
                            },
                          ]
                        : []),
                      ...(formik.values.actionType ===
                      EventActionTypeEnum.BUSINESS_LOGIC
                        ? [
                            {
                              label: t("email-language"),
                              required: isRequiredField(
                                eventSettingCreateEditShema,
                                "emailLanguage",
                                formik.values
                              ),
                              value: (
                                <FormControl
                                  fullWidth
                                  error={
                                    formik.touched.emailLanguage &&
                                    Boolean(formik.errors.emailLanguage)
                                  }
                                >
                                  <Select
                                    id="emailLanguage"
                                    name="emailLanguage"
                                    size="small"
                                    value={formik.values.emailLanguage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  >
                                    <MenuItem value="en-GB" key="en-GB">
                                      {t("english-gb", { ns: "auth" })}
                                    </MenuItem>
                                  </Select>
                                  <FormHelperText>
                                    <FormikErrorMessage
                                      touched={formik.touched.emailLanguage}
                                      error={formik.errors.emailLanguage}
                                      translatedFieldName={t("email-language")}
                                    />
                                  </FormHelperText>
                                </FormControl>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  ></DataList>
                </PbTabPanel>
              )}
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default EventSettingCreateEditPage;
