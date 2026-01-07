import { CardContent } from "@mui/material";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { PbTab, PbTabPanel, PbTabs } from "components/platbricks/shared/PbTab";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import {
  LookupCreateUpdateDto,
  LookupDetailsDto,
  LookupGroupKey,
} from "interfaces/v12/lookup/lookup";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLookupService } from "services/LookupService";
import { useNotificationService } from "services/NotificationService";
import LookupCreateEdit from "./components/LookupCreateEdit";
import {
  LookupCreateEditSchema,
  YupLookupCreateEdit,
} from "./yup/LookupCreateEditSchema";

const groupTitle = (g: LookupGroupKey, t: any) => t(`lookups:${g}`, g); // e.g. translate with keys like lookups.PaymentType

const LookupCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { groupKey, id } = useParams(); // routes: /lookups/:groupKey/new, /lookups/:groupKey/:id/edit
  const group = groupKey as LookupGroupKey;

  const [tab, setTab] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [pageBlocker, setPageBlocker] = useState(false);
  const [entity, setEntity] = useState<LookupDetailsDto | null>(null);

  const lookupService = useLookupService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const initial: YupLookupCreateEdit = useMemo(
    () => ({
      label: entity?.label ?? "",
      sortOrder: entity?.sortOrder ?? 10,
      isActive: entity?.isActive ?? true,
    }),
    [entity]
  );

  const title = id ? groupTitle(group, t) : t("common:create");
  const breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    { label: t("lookups:title"), to: "/lookups" },
    { label: groupTitle(group, t), to: `/lookups/${group}` },
    { label: id ? t("common:edit") : t("common:create") },
  ];

  const formik = useFormik({
    initialValues: initial,
    validationSchema: LookupCreateEditSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setPageBlocker(true);
      const payload: LookupCreateUpdateDto = { groupKey: group, ...values };
      try {
        if (id) {
          await lookupService.update(id, payload);
          formik.resetForm({ values });
          notificationService.handleApiSuccessMessage(
            "lookup",
            "updated",
            "common"
          );
          navigate(`/lookups/${group}/${id}`);
        } else {
          const created = await lookupService.create(payload);
          formik.resetForm({ values });
          notificationService.handleApiSuccessMessage(
            "lookup",
            "created",
            "common"
          );
          navigate(`/lookups/${group}/${created}`);
        }
      } catch (err: any) {
        notificationService.handleApiErrorMessage(err?.data, "common");
      } finally {
        setPageBlocker(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      lookupService
        .getById(id)
        .then(setEntity)
        .finally(() => setPageReady(true));
    } else {
      setPageReady(true);
    }
  }, [id]);

  const setAllFieldsTouched = async () => {
    const validationErrors = await formik.validateForm();
    formik.setTouched(setNestedObjectValues(validationErrors, true));
  };

  const changeTab = (val: number) => {
    setAllFieldsTouched();
    setTab(val);
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? entity?.label : group}
      showLoading={!pageReady}
      showBackdrop={pageBlocker}
      actions={[
        { title: t("common:save"), onclick: formik.handleSubmit, icon: "Save" },
      ]}
      hasSingleActionButton
    >
      <NavBlocker when={formik.dirty && !formik.isSubmitting && !pageBlocker} />
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <PbCard px={2} pt={2}>
            <PbTabs value={tab} onChange={(_: any, v: number) => changeTab(v)}>
              <PbTab label={t("common:details")} />
            </PbTabs>
            <CardContent>
              <PbTabPanel value={tab} index={0}>
                <LookupCreateEdit formik={formik} />
              </PbTabPanel>
            </CardContent>
          </PbCard>
        </form>
      </FormikProvider>
    </Page>
  );
};
export default LookupCreateEditPage;
