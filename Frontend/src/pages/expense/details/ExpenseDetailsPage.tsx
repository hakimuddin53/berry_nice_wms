import { CardContent, Grid, Typography } from "@mui/material";
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
import { useLookupByIdFetcher } from "hooks/queries/useLookupQueries";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import { ExpenseDetailsDto } from "interfaces/v12/expense/expenseDetails/expenseDetailsDto";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useExpenseService } from "services/ExpenseService";
import { guid } from "types/guid";

function ExpenseDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ExpenseService = useExpenseService();
  const fetchLookupById = useLookupByIdFetcher();
  const [expense, setExpense] = useState<ExpenseDetailsDto | null>(null);
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null);

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const loadExpense = useCallback(() => {
    ExpenseService.getExpenseById(id as guid)
      .then((expense) => {
        setExpense(expense);
        if (expense.category) {
          fetchLookupById(expense.category)
            .then((lookup) =>
              setCategoryLabel(lookup?.label ?? expense.category)
            )
            .catch(() => setCategoryLabel(expense.category));
        } else {
          setCategoryLabel(null);
        }
      })
      .catch((err) => {});
  }, [ExpenseService, fetchLookupById, id]);

  useEffect(() => {
    loadExpense();
  }, [loadExpense, id]);

  if (!expense) {
    return (
      <Page
        pagename={t("expense")}
        breadcrumbs={[]}
        title={t("expense-not-found")}
      ></Page>
    );
  }

  return (
    <Page
      title={t("expense")}
      subtitle={expense.description}
      showBackdrop={pageBlocker}
      hasSingleActionButton
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("expense"),
          to: `/expense`,
        },
        {
          label: expense.description,
        },
      ]}
      actions={[
        {
          title: t("common:edit"),
          to: "edit",
          icon: "Edit",
        },
        // {
        //   title: t("delete"),
        //   icon: "Delete",
        //   onclick: () => {
        //     OpenDeleteConfirmationDialog({
        //       onConfirmDeletion: async () => {
        //         await ExpenseService.deleteExpense(expense.id);
        //       },
        //       setPageBlocker: setPageBlocker,
        //       entity: "expense",
        //       translationNamespace: "common",
        //       deleteDataName: expense.description,
        //       redirectLink: `/expense`,
        //     });
        //   },
        // },
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
            <Grid container rowSpacing={100}>
              <Grid item xs={6}>
                <KeyValueList gridTemplateColumns="2fr 4fr">
                  <KeyValuePair label={t("description")}>
                    <EasyCopy clipboard={expense.description}>
                      {expense.description}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("amount")}>
                    <EasyCopy clipboard={expense.amount.toString()}>
                      {expense.amount}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("category")}>
                    {categoryLabel ?? expense.category}
                  </KeyValuePair>
                  <KeyValuePair label={t("remark")}>
                    {expense.remark || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={expense.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={expense.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={expense.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={expense.changedById} placeholder="-" />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>

          <PbTabPanel value={tab} index={10}>
            <Typography variant="subtitle2" gutterBottom display="inline">
              {t("feature-unavailable")}
            </Typography>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </Page>
  );
}

export default ExpenseDetailsPage;
