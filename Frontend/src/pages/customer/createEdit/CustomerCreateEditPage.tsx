import { CardContent, TextField } from "@mui/material";
import {
  DataList,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { CustomerCreateUpdateDto } from "interfaces/v12/customer/customerCreateUpdate/customerCreateUpdateDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerService } from "services/CustomerService";
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
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [customer, setCustomer] = useState<YupCustomerCreateEdit>({
    name: "",
    phone: "",
    email: "",
    address: "",
    customerTypeId: "",
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

      // Ensure phone is a string and coerce guid type
      const submitValues: CustomerCreateUpdateDto = {
        ...values,
        phone: String(values.phone || ""),
        customerTypeId: guid(values.customerTypeId || ""),
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
          const customerData = {
            ...customer,
            customerTypeId:
              typeof customer.customerTypeId === "object"
                ? customer.customerTypeId?.id ||
                  customer.customerTypeId?.value ||
                  ""
                : customer.customerTypeId || "",
          };

          setCustomer(customerData);

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
                      "customerTypeId"
                    ),
                    value: (
                      <LookupAutocomplete
                        groupKey={LookupGroupKey.CustomerType}
                        name="customerTypeId"
                        value={formik.values.customerTypeId}
                        onChange={(newValue, option) => {
                          formik.setFieldValue(
                            "customerTypeId",
                            newValue || ""
                          );
                        }}
                        onBlur={() => formik.setFieldTouched("customerTypeId")}
                        error={
                          formik.touched.customerTypeId &&
                          Boolean(formik.errors.customerTypeId)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.customerTypeId}
                            error={formik.errors.customerTypeId}
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
