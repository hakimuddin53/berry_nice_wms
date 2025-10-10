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
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
import { useLookupService } from "services/LookupService";
import { useNotificationService } from "services/NotificationService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  customerCreateEditSchema,
  YupCustomerCreateEdit,
} from "./yup/customerCreateEditSchema";

const CustomerCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const CustomerService = useCustomerService();
  const LookupService = useLookupService();

  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [customer, setCustomer] = useState<YupCustomerCreateEdit>({
    customerCode: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    customerType: "",
  });

  let title = t("create-customer");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("customer"),
      to: "/customer",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("customer");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("customer"),
        to: "/customer",
      },
      {
        label: customer.name as string,
        to: "/customer/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: customer,
    validationSchema: customerCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      // Ensure phone is a string
      const submitValues = {
        ...values,
        phone: String(values.phone || ""),
      };

      if (!id) {
        CustomerService.createCustomer(submitValues)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "customer",
              "created",
              "customer"
            );
            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "customer");
          });
      } else {
        CustomerService.updateCustomer(id as guid, submitValues)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "customer",
              "updated",
              "customer"
            );
            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "customer");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (id) {
      CustomerService.getCustomerById(id as guid)
        .then((customer: any) => {
          setCustomer(customer);

          setPageReady(true);
        })
        .catch((err) => {
          notificationService.handleApiErrorMessage(err.data, "common");
        });
    } else {
      setPageReady(true);
    }
  }, [id, CustomerService]);

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
        navigate(`/customer/${id}`);
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
                    label: t("customer-code"),
                    required: isRequiredField(
                      customerCreateEditSchema,
                      "customerCode"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="customerCode"
                        name="customerCode"
                        size="small"
                        value={formik.values.customerCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customerCode &&
                          Boolean(formik.errors.customerCode)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.customerCode}
                            error={formik.errors.customerCode}
                            translatedFieldName={t("customer-code")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("name"),
                    required: isRequiredField(customerCreateEditSchema, "name"),
                    value: (
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        size="small"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.name}
                            error={formik.errors.name}
                            translatedFieldName={t("name")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("phone"),
                    value: (
                      <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        size="small"
                        type="number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("email"),
                    value: (
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        size="small"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.email}
                            error={formik.errors.email}
                            translatedFieldName={t("email")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("address"),
                    value: (
                      <TextField
                        fullWidth
                        id="address"
                        name="address"
                        size="small"
                        multiline
                        rows={3}
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("customer-type"),
                    required: isRequiredField(
                      customerCreateEditSchema,
                      "customerType"
                    ),
                    value: (
                      <SelectAsync2
                        name="customerType"
                        ids={useMemo(
                          () =>
                            formik.values.customerType
                              ? [formik.values.customerType]
                              : [],
                          [formik.values.customerType]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "customerType",
                            newOption?.value || ""
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: string[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.CustomerType,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.customerType}
                            error={formik.errors.customerType}
                            translatedFieldName={t("customer-type")}
                          />
                        }
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

export default CustomerCreateEditPage;
