import { CardContent } from "@mui/material";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { PbTab, PbTabPanel, PbTabs } from "components/platbricks/shared/PbTab";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useUserService } from "services/UserService";
import { EMPTY_GUID, guid } from "types/guid";
import { formikObjectHasHeadTouchedErrors } from "utils/formikHelpers";
import UserCreateEdit from "./components/UserCreateEdit";
import {
  UserCreateEditSchema,
  YupUserCreateEdit,
} from "./yup/UserCreateEditSchema";

const UserCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const UserService = useUserService();

  const [User, setUser] = useState<YupUserCreateEdit>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRoleId: EMPTY_GUID as guid,
  });

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-user");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("user"),
      to: "/user",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("user");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: User.name as string,
        to: "/user",
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: User,
    validationSchema: UserCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      console.log(formik.errors);
      if (!id) {
        UserService.createUser(values)
          .then((createdResult) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "user",
              "created",
              "common"
            );

            navigateToDetails(createdResult.id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      } else {
        UserService.updateUser(id as guid, values as any)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "user",
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
      UserService.getUserById(id as guid)
        .then((YardResource: any) => {
          setUser(YardResource);
          setPageReady(true);
        })
        .catch((err) => {});
    } else {
      setPageReady(true);
    }
  }, [id, UserService]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      console.log(formik.errors);
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
        navigate(`/user/${id}`);
      }, 100);
    }
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? User.name : ""}
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
                <UserCreateEdit formik={formik} id={id}></UserCreateEdit>
              </PbTabPanel>
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};

export default UserCreateEditPage;
