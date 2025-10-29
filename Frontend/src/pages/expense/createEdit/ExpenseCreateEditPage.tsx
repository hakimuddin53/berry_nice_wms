import { CardContent, TextField } from "@mui/material";
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
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useExpenseService } from "services/ExpenseService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import {
  expenseCreateEditSchema,
  YupExpenseCreateEdit,
} from "./yup/expenseCreateEditSchema";

const ExpenseCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ExpenseService = useExpenseService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [expense, setExpense] = useState<YupExpenseCreateEdit>({
    description: "",
    amount: 0,
    category: "",
    remark: "",
  });

  let title = t("create-expense");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("expense"),
      to: "/expense",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("expense");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("expense"),
        to: "/expense",
      },
      {
        label: expense.description as string,
        to: "/expense/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: expense,
    validationSchema: expenseCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        ExpenseService.createExpense(values)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "expense",
              "created",
              "expense"
            );
            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "expense");
          });
      } else {
        ExpenseService.updateExpense(id as guid, values)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "expense",
              "updated",
              "expense"
            );
            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "expense");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (id) {
      ExpenseService.getExpenseById(id as guid)
        .then((expense: any) => {
          setExpense(expense);

          setPageReady(true);
        })
        .catch((err) => {
          notificationService.handleApiErrorMessage(err.data, "common");
        });
    } else {
      setPageReady(true);
    }
  }, [id, ExpenseService]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      notificationService.handleErrorMessage(
        t("common:please-fix-the-errors-and-try-again")
      );
    }
  }, [formik.submitCount, formik.isSubmitting, formik.isValid, t]);

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
        navigate(`/expense/${id}`);
      }, 100);
    }
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
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
        <PbCard px={2} pt={2}>
          <PbTabs
            value={tab}
            onChange={(event: React.SyntheticEvent, newValue: number) => {
              changeTab(newValue);
            }}
          >
            <PbTab label={t("common:details")} />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <DataList
                hideDevider={true}
                data={[
                  {
                    label: t("description"),
                    required: isRequiredField(
                      expenseCreateEditSchema,
                      "description"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="description"
                        name="description"
                        size="small"
                        multiline
                        rows={3}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.description}
                            error={formik.errors.description}
                            translatedFieldName={t("description")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("amount"),
                    required: isRequiredField(
                      expenseCreateEditSchema,
                      "amount"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="amount"
                        name="amount"
                        type="number"
                        size="small"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.amount && Boolean(formik.errors.amount)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.amount}
                            error={formik.errors.amount}
                            translatedFieldName={t("amount")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("category"),
                    required: isRequiredField(
                      expenseCreateEditSchema,
                      "category"
                    ),
                    value: (
                      <LookupAutocomplete
                        groupKey={LookupGroupKey.ExpenseCategory}
                        name="category"
                        value={formik.values.category ?? ""}
                        onChange={(newValue) =>
                          formik.setFieldValue("category", newValue || "")
                        }
                        onBlur={() => formik.setFieldTouched("category")}
                        error={
                          formik.touched.category &&
                          Boolean(formik.errors.category)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.category}
                            error={formik.errors.category}
                            translatedFieldName={t("category")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("remark"),
                    value: (
                      <TextField
                        fullWidth
                        id="remark"
                        name="remark"
                        size="small"
                        multiline
                        rows={2}
                        value={formik.values.remark}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                ]}
              ></DataList>
            </PbTabPanel>
          </CardContent>
        </PbCard>
      </FormikProvider>
    </Page>
  );
};

export default ExpenseCreateEditPage;
