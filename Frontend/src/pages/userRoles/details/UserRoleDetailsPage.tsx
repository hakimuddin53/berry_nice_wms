import { CardContent, Chip } from "@mui/material";
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
import { UserRoleDetailsDto } from "interfaces/v12/userRole/userRole";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useUserRoleService } from "services/UserRoleService";
import { guid } from "types/guid";
import { getModuleName } from "utils/helper";

function UserRoleDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const UserRoleService = useUserRoleService();
  const [userRole, setUserRole] = useState<UserRoleDetailsDto | null>(null);

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    UserRoleService.getUserRoleById(id as guid)
      .then((userRole) => setUserRole(userRole))
      .catch((err) => {});
  }, [UserRoleService, id]);

  if (!userRole) {
    return (
      <Page
        pagename={t("userRole")}
        breadcrumbs={[]}
        title={"Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("userRole")}
      subtitle={userRole.displayName}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("userRoles"),
          to: `/user-role`,
        },
        {
          label: userRole.displayName,
        },
      ]}
      actions={[
        {
          title: t("common:edit"),
          to: "edit",
          icon: "Edit",
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
                <EasyCopy clipboard={userRole.displayName}>
                  {userRole.displayName}
                </EasyCopy>
              </KeyValuePair>
              <KeyValuePair label={t("module")}>
                <>
                  {userRole.module.map((moduleNumber) => (
                    <Chip
                      key={moduleNumber}
                      label={t(getModuleName(moduleNumber))}
                      sx={{ margin: "4px" }}
                    />
                  ))}
                </>
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default UserRoleDetailsPage;
