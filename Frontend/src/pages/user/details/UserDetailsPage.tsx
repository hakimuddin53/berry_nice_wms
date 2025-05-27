import { CardContent } from "@mui/material";
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
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import { UserDetailsV12Dto } from "interfaces/v12/user/userDetails/UserDetailsV12Dto";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useUserService } from "services/UserService";
import { guid } from "types/guid";

function UserDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const UserService = useUserService();
  const [user, setUser] = useState<UserDetailsV12Dto | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  useEffect(() => {
    UserService.getUserById(id as guid)
      .then((user) => setUser(user))
      .catch((err) => {});
  }, [UserService, id]);

  if (!user) {
    return (
      <Page pagename={t("user")} breadcrumbs={[]} title={"Not Found"}></Page>
    );
  }

  return (
    <Page
      title={t("user")}
      subtitle={user.email}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("users"),
          to: `/user`,
        },
        {
          label: user.email,
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
              <KeyValuePair label={t("email")}>
                <EasyCopy clipboard={user.email}>{user.email}</EasyCopy>
              </KeyValuePair>
              <KeyValuePair label={t("name")}>{user.name}</KeyValuePair>
              <KeyValuePair label={t("userRole")}>
                {user.userRoleName}
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default UserDetailsPage;
