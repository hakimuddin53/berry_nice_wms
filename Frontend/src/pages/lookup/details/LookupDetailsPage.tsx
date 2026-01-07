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
import { LookupDetailsDto, LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLookupService } from "services/LookupService";

const LookupDetailsPage = () => {
  const { t } = useTranslation();
  const { groupKey, id } = useParams();
  const group = groupKey as LookupGroupKey;

  const svc = useLookupService();
  const [tab, setTab] = useState(0);
  const [entity, setEntity] = useState<LookupDetailsDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    svc
      .getById(id)
      .then(setEntity)
      .catch(() => navigate(`/lookups/${group}`));
  }, [id, group]);

  if (!entity) return <Page title={t("lookups:title")} breadcrumbs={[]} />;

  return (
    <Page
      title={t(`lookups:${group}`, group)}
      subtitle={entity.label}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("lookups:title"), to: "/lookups" },
        { label: t(`lookups:${group}`, group), to: `/lookups/${group}` },
        { label: entity.label },
      ]}
      actions={[{ title: t("common:edit"), to: "edit", icon: "Edit" }]}
    >
      <PbCard px={2} pt={2}>
        <PbTabs
          value={tab}
          onChange={(_: any, v: SetStateAction<number>) => setTab(v)}
        >
          <PbTab label={t("common:details")} />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <KeyValueList gridTemplateColumns="2fr 4fr">
              <KeyValuePair label={t("label")}>
                <EasyCopy clipboard={entity.label}>{entity.label}</EasyCopy>
              </KeyValuePair>
              <KeyValuePair label={t("sort-order")}>
                {entity.sortOrder}
              </KeyValuePair>
              <KeyValuePair label={t("active")}>
                {entity.isActive ? t("common:yes") : t("common:no")}
              </KeyValuePair>
              {entity.createdAt && (
                <KeyValuePair label={t("created-at")}>
                  <UserDateTime date={entity.createdAt} />
                </KeyValuePair>
              )}
              {entity.changedAt && (
                <KeyValuePair label={t("changed-at")}>
                  <UserDateTime date={entity.changedAt} />
                </KeyValuePair>
              )}
              {entity.createdById && (
                <KeyValuePair label={t("created-by")}>
                  <UserName userId={entity.createdById} placeholder="-" />
                </KeyValuePair>
              )}
              {entity.changedById && (
                <KeyValuePair label={t("changed-by")}>
                  <UserName userId={entity.changedById} placeholder="-" />
                </KeyValuePair>
              )}
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
};
export default LookupDetailsPage;
