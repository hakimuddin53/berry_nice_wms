import { CardContent } from "@mui/material";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { PbTab, PbTabPanel, PbTabs } from "components/platbricks/shared/PbTab";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useClientCodeService } from "services/ClientCodeService";
import { useNotificationService } from "services/NotificationService";
import { guid } from "types/guid";
import { formikObjectHasHeadTouchedErrors } from "utils/formikHelpers";
import ClientCodeCreateEdit from "./components/ClientCodeCreateEditComponent";
import {
  ClientCodeCreateEditSchema,
  YupClientCodeCreateEdit,
} from "./yup/YupClientCodeSchema";

const ClientCodeCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ClientCodeService = useClientCodeService();

  const [clientCode, setClientCode] = useState<YupClientCodeCreateEdit>({
    name: "",
  });

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-clientCode");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("clientCode"),
      to: "/client-code",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("clientCode");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: clientCode.name as string,
        to: "/client-code",
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: clientCode,
    validationSchema: ClientCodeCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);
      if (!id) {
        ClientCodeService.createClientCode(values)
          .then((createdResult) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "clientCode",
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
        ClientCodeService.updateClientCode(id as guid, values as any)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "clientCode",
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
      ClientCodeService.getClientCodeById(id as guid)
        .then((resource: any) => {
          setClientCode(resource);
          setPageReady(true);
        })
        .catch((err) => {});
    } else {
      setPageReady(true);
    }
  }, [id, ClientCodeService]);

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
        navigate(`/client-code/${id}`);
      }, 100);
    }
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? clientCode.name : ""}
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
                <ClientCodeCreateEdit formik={formik}></ClientCodeCreateEdit>
              </PbTabPanel>
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default ClientCodeCreateEditPage;
