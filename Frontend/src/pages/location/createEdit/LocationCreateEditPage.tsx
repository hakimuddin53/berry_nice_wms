import { CardContent } from "@mui/material";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { PbTab, PbTabPanel, PbTabs } from "components/platbricks/shared/PbTab";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLocationService } from "services/LocationService";
import { useNotificationService } from "services/NotificationService";
import { guid } from "types/guid";
import { formikObjectHasHeadTouchedErrors } from "utils/formikHelpers";
import LocationCreateEdit from "./components/LocationCreateEdit";
import {
  LocationCreateEditSchema,
  YupLocationCreateEdit,
} from "./yup/LocationCreateEditSchema";

const LocationCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const LocationService = useLocationService();

  const [Location, setLocation] = useState<YupLocationCreateEdit>({
    name: "",
  });

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-location");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("location"),
      to: "/location",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("location");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: Location.name as string,
        to: "/location",
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: Location,
    validationSchema: LocationCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);
      if (!id) {
        LocationService.createLocation(values)
          .then((createdResult) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "location",
              "created",
              "common"
            );

            navigateToDetails(createdResult);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      } else {
        LocationService.updateLocation(id as guid, values as any)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "location",
              "updated",
              "common"
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (id) {
      LocationService.getLocationById(id as guid)
        .then((YardResource: any) => {
          setLocation(YardResource);
          setPageReady(true);
        })
        .catch((err) => {});
    } else {
      setPageReady(true);
    }
  }, [id, LocationService]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      notificationService.handleErrorMessage(
        t("common:please-fix-the-errors-and-try-again")
      );
    }
  }, [
    formik.submitCount,
    formik.isSubmitting,
    formik.isValid,
    t,
    notificationService,
  ]);

  const setAllFieldsTouched = async () => {
    const validationErrors = await formik.validateForm();
    formik.setTouched(setNestedObjectValues(validationErrors, true));
  };

  const changeTab = (val: number) => {
    setAllFieldsTouched();
    setTab(val);
  };

  const navigateToDetails = (id: string | undefined) => {
    if (id) {
      setTimeout(() => {
        navigate(`/location/${id}`);
      }, 100);
    }
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? Location.name : ""}
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
                changeTab(newValue);
              }}
            >
              <PbTab
                label={t("common:details")}
                haserror={formikObjectHasHeadTouchedErrors(
                  formik.errors,
                  formik.touched
                )}
              />
            </PbTabs>
            <CardContent>
              <PbTabPanel value={tab} index={0}>
                <LocationCreateEdit formik={formik}></LocationCreateEdit>
              </PbTabPanel>
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default LocationCreateEditPage;
