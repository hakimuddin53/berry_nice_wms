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
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useSupplierService } from "services/SupplierService";
import { guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  supplierCreateEditSchema,
  YupSupplierCreateEdit,
} from "./yup/supplierCreateEditSchema";

const SupplierCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const SupplierService = useSupplierService();

  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [supplier, setSupplier] = useState<YupSupplierCreateEdit>({
    supplierCode: "",
    name: "",
    ic: "",
    taxId: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    contactNo: "",
    email: "",
  });

  let title = t("create-supplier");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("supplier"),
      to: "/supplier",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("supplier");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("supplier"),
        to: "/supplier",
      },
      {
        label: supplier.name as string,
        to: "/supplier/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: supplier,
    validationSchema: supplierCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);
      const contactNo =
        values.contactNo !== undefined && values.contactNo !== null
          ? String(values.contactNo).trim()
          : "";
      const payload = {
        ...values,
        contactNo,
      };

      if (!id) {
        SupplierService.createSupplier(payload)
          .then((result) => {
            resetForm({ values: payload });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "supplier",
              "created",
              "supplier"
            );
            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "supplier");
          });
      } else {
        SupplierService.updateSupplier(id as guid, payload)
          .then((result) => {
            resetForm({ values: payload });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "supplier",
              "updated",
              "supplier"
            );
            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "supplier");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (id) {
      SupplierService.getSupplierById(id as guid)
        .then((supplier: any) => {
          setSupplier(supplier);

          setPageReady(true);
        })
        .catch((err) => {
          notificationService.handleApiErrorMessage(err.data, "common");
        });
    } else {
      setPageReady(true);
    }
  }, [id, SupplierService]);

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
        navigate(`/supplier/${id}`);
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
      hasSingleActionButton
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
                    label: t("supplier-code"),
                    required: isRequiredField(
                      supplierCreateEditSchema,
                      "supplierCode"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="supplierCode"
                        name="supplierCode"
                        size="small"
                        value={formik.values.supplierCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.supplierCode &&
                          Boolean(formik.errors.supplierCode)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.supplierCode}
                            error={formik.errors.supplierCode}
                            translatedFieldName={t("supplier-code")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("name"),
                    required: isRequiredField(supplierCreateEditSchema, "name"),
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
                    label: t("ic"),
                    value: (
                      <TextField
                        fullWidth
                        id="ic"
                        name="ic"
                        size="small"
                        value={formik.values.ic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("tax-id"),
                    value: (
                      <TextField
                        fullWidth
                        id="taxId"
                        name="taxId"
                        size="small"
                        value={formik.values.taxId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("address1"),
                    value: (
                      <TextField
                        fullWidth
                        id="address1"
                        name="address1"
                        size="small"
                        value={formik.values.address1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("address2"),
                    value: (
                      <TextField
                        fullWidth
                        id="address2"
                        name="address2"
                        size="small"
                        value={formik.values.address2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("address3"),
                    value: (
                      <TextField
                        fullWidth
                        id="address3"
                        name="address3"
                        size="small"
                        value={formik.values.address3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("address4"),
                    value: (
                      <TextField
                        fullWidth
                        id="address4"
                        name="address4"
                        size="small"
                        value={formik.values.address4}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("contact-no"),
                    value: (
                      <TextField
                        fullWidth
                        id="contactNo"
                        name="contactNo"
                        inputMode="tel"
                        size="small"
                        value={formik.values.contactNo}
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
                ]}
              ></DataList>
            </PbTabPanel>
          </CardContent>
        </PbCard>
      </FormikProvider>
    </Page>
  );
};

export default SupplierCreateEditPage;
