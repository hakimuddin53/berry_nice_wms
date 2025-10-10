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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useNotificationService } from "services/NotificationService";
import { useProductService } from "services/ProductService";
import { useLookupService } from "services/LookupService";
import { EMPTY_GUID, guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  productCreateEditShema,
  YupProductCreateEdit,
} from "./yup/productCreateEditShema";
import { ProductCreateUpdateDto } from "interfaces/v12/product/productCreateUpdate/productCreateUpdateDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";

const ProductCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const LookupService = useLookupService();

  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [product, setProduct] = useState<YupProductCreateEdit>({
    productCode: "",
    categoryId: EMPTY_GUID as guid,
    brandId: undefined,
    model: undefined,
    colorId: undefined,
    storageId: undefined,
    ramId: undefined,
    processorId: undefined,
    screenSizeId: undefined,
    lowQty: 0,
  });

  let title = t("create-product");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("product"),
      to: "/product",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("common:product");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("product"),
        to: "/product",
      },
      {
        label: product.productCode as string,
        to: "/product/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: product,
    validationSchema: productCreateEditShema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      // Transform values to match ProductCreateUpdateDto
      const transformedValues: ProductCreateUpdateDto = {
        productCode: values.productCode,
        categoryId: values.categoryId!,
        brandId: values.brandId || undefined,
        model: values.model || undefined,
        colorId: values.colorId || undefined,
        storageId: values.storageId || undefined,
        ramId: values.ramId || undefined,
        processorId: values.processorId || undefined,
        screenSizeId: values.screenSizeId || undefined,
        lowQty: values.lowQty,
      };

      if (!id) {
        ProductService.createProduct(transformedValues)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "product",
              "created",
              "product"
            );
            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "product");
          });
      } else {
        ProductService.updateProduct(id!, transformedValues)
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);
            notificationService.handleApiSuccessMessage(
              "product",
              "updated",
              "product"
            );
            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "product");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  useEffect(() => {
    if (id) {
      ProductService.getProductById(id)
        .then((product: any) => {
          // Transform ProductDetailsDto to YupProductCreateEdit
          const formProduct: YupProductCreateEdit = {
            productCode: product.productCode,
            categoryId: product.categoryId,
            brandId: product.brandId,
            model: product.model,
            colorId: product.colorId,
            storageId: product.storageId,
            ramId: product.ramId,
            processorId: product.processorId,
            screenSizeId: product.screenSizeId,
            lowQty: product.lowQty,
          };
          setProduct(formProduct);

          setPageReady(true);
        })
        .catch((err) => {
          notificationService.handleApiErrorMessage(err.data, "common");
        });
    } else {
      setPageReady(true);
    }
  }, [id, ProductService]);

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
        navigate(`/product/${id}`);
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
                    label: t("productCode"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "productCode"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="sku"
                        name="productCode"
                        size="small"
                        value={formik.values.productCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.productCode &&
                          Boolean(formik.errors.productCode)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.productCode}
                            error={formik.errors.productCode}
                            translatedFieldName={t("productCode")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("category"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "categoryId"
                    ),
                    value: (
                      <SelectAsync2
                        name="categoryId"
                        ids={useMemo(
                          () =>
                            formik.values.categoryId
                              ? [formik.values.categoryId]
                              : [],
                          [formik.values.categoryId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "categoryId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.ProductCategory,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.categoryId}
                            error={formik.errors.categoryId}
                            translatedFieldName={t("category")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("brand"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "brandId"
                    ),
                    value: (
                      <SelectAsync2
                        name="brandId"
                        ids={useMemo(
                          () =>
                            formik.values.brandId
                              ? [formik.values.brandId]
                              : [],
                          [formik.values.brandId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "brandId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.Brand,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.brandId}
                            error={formik.errors.brandId}
                            translatedFieldName={t("brand")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("model"),
                    required: isRequiredField(productCreateEditShema, "model"),
                    value: (
                      <TextField
                        name="model"
                        value={formik.values.model || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.model}
                            error={formik.errors.model}
                            translatedFieldName={t("model")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("color"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "colorId"
                    ),
                    value: (
                      <SelectAsync2
                        name="colorId"
                        ids={useMemo(
                          () =>
                            formik.values.colorId
                              ? [formik.values.colorId]
                              : [],
                          [formik.values.colorId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "colorId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.Color,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.colorId}
                            error={formik.errors.colorId}
                            translatedFieldName={t("color")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("storage"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "storageId"
                    ),
                    value: (
                      <SelectAsync2
                        name="storageId"
                        ids={useMemo(
                          () =>
                            formik.values.storageId
                              ? [formik.values.storageId]
                              : [],
                          [formik.values.storageId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "storageId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.Storage,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.storageId}
                            error={formik.errors.storageId}
                            translatedFieldName={t("storage")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("ram"),
                    required: isRequiredField(productCreateEditShema, "ramId"),
                    value: (
                      <SelectAsync2
                        name="ramId"
                        ids={useMemo(
                          () =>
                            formik.values.ramId ? [formik.values.ramId] : [],
                          [formik.values.ramId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "ramId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.Ram,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.ramId}
                            error={formik.errors.ramId}
                            translatedFieldName={t("ram")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("processor"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "processorId"
                    ),
                    value: (
                      <SelectAsync2
                        name="processorId"
                        ids={useMemo(
                          () =>
                            formik.values.processorId
                              ? [formik.values.processorId]
                              : [],
                          [formik.values.processorId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "processorId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.Processor,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.processorId}
                            error={formik.errors.processorId}
                            translatedFieldName={t("processor")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("screenSize"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "screenSizeId"
                    ),
                    value: (
                      <SelectAsync2
                        name="screenSizeId"
                        ids={useMemo(
                          () =>
                            formik.values.screenSizeId
                              ? [formik.values.screenSizeId]
                              : [],
                          [formik.values.screenSizeId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "screenSizeId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          LookupService.getSelectOptions(
                            LookupGroupKey.ScreenSize,
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.screenSizeId}
                            error={formik.errors.screenSizeId}
                            translatedFieldName={t("screenSize")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("lowQty"),
                    required: isRequiredField(productCreateEditShema, "lowQty"),
                    value: (
                      <TextField
                        fullWidth
                        id="lowQty"
                        name="lowQty"
                        type="number"
                        size="small"
                        value={formik.values.lowQty}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.lowQty && Boolean(formik.errors.lowQty)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.lowQty}
                            error={formik.errors.lowQty}
                            translatedFieldName={t("lowQty")}
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

export default ProductCreateEditPage;
