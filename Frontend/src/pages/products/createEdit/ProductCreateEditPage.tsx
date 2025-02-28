import {
  CardContent,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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
import { ClientCodeEnum } from "interfaces/enums/GlobalEnums";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCartonSizeService } from "services/CartonSizeService";
import { useCategoryService } from "services/CategoryService";
import { useColourService } from "services/ColourService";
import { useDesignService } from "services/DesignService";
import { useNotificationService } from "services/NotificationService";
import { useProductService } from "services/ProductService";
import { useSizeService } from "services/SizeService";
import { useWarehouseService } from "services/WarehouseService";
import { EMPTY_GUID, guid } from "types/guid";
import { isRequiredField } from "utils/formikHelpers";
import {
  productCreateEditShema,
  YupProductCreateEdit,
} from "./yup/productCreateEditShema";

const ProductCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const WarehouseService = useWarehouseService();
  const CategoryService = useCategoryService();
  const SizeService = useSizeService();
  const ColourService = useColourService();
  const DesignService = useDesignService();
  const ProductService = useProductService();
  const CartonSizeService = useCartonSizeService();

  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState<boolean>(false);
  const [pageBlocker, setPageBlocker] = useState(false);

  const [product, setProduct] = useState<YupProductCreateEdit>({
    name: "",
    itemCode: "",
    clientCode: "PETRONAS" as ClientCodeEnum,
    quantityPerCarton: 0,
    categoryId: EMPTY_GUID as guid,
    sizeId: EMPTY_GUID as guid,
    colourId: EMPTY_GUID as guid,
    designId: EMPTY_GUID as guid,
    cartonSizeId: EMPTY_GUID as guid,
    productPhotoUrl: "",
    listPrice: 0,
    threshold: 0,
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
        label: product.name as string,
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

      if (!id) {
        console.log(values);
        ProductService.createProduct(values)
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
        ProductService.updateProduct(id as guid, values)
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
      ProductService.getProductById(id as guid)
        .then((product: any) => {
          setProduct(product);

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
    console.log(formik);
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
                    label: t("name"),
                    required: isRequiredField(productCreateEditShema, "name"),
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
                    label: t("item-code"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "itemCode"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="itemCode"
                        name="itemCode"
                        size="small"
                        value={formik.values.itemCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.itemCode &&
                          Boolean(formik.errors.itemCode)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.itemCode}
                            error={formik.errors.itemCode}
                            translatedFieldName={t("item-code")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("client-code"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "clientCode"
                    ),
                    value: (
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.clientCode &&
                          Boolean(formik.errors.clientCode)
                        }
                      >
                        <Select
                          id="clientCode"
                          name="clientCode"
                          size="small"
                          value={formik.values.clientCode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {Object.values(ClientCodeEnum).map((p) => (
                            <MenuItem value={p} key={p}>
                              {t(p, { ns: "enumerables" })}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          <FormikErrorMessage
                            touched={formik.touched.clientCode}
                            error={formik.errors.clientCode}
                            translatedFieldName={t("client-code")}
                          />
                        </FormHelperText>
                      </FormControl>
                    ),
                  },
                  {
                    label: t("category"),
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
                          CategoryService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: t("size"),
                    value: (
                      <SelectAsync2
                        name="sizeId"
                        ids={useMemo(
                          () =>
                            formik.values.sizeId ? [formik.values.sizeId] : [],
                          [formik.values.sizeId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "sizeId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          SizeService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: t("colour"),
                    value: (
                      <SelectAsync2
                        name="colourId"
                        ids={useMemo(
                          () =>
                            formik.values.colourId
                              ? [formik.values.colourId]
                              : [],
                          [formik.values.colourId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "colourId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          ColourService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: t("design"),
                    value: (
                      <SelectAsync2
                        name="designId"
                        ids={useMemo(
                          () =>
                            formik.values.designId
                              ? [formik.values.designId]
                              : [],
                          [formik.values.designId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "designId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          DesignService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: t("cartonSize"),
                    value: (
                      <SelectAsync2
                        name="cartonSizeId"
                        ids={useMemo(
                          () =>
                            formik.values.cartonSizeId
                              ? [formik.values.cartonSizeId]
                              : [],
                          [formik.values.cartonSizeId]
                        )}
                        onSelectionChange={async (newOption) => {
                          formik.setFieldValue(
                            "cartonSizeId",
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: guid[]
                        ) =>
                          CartonSizeService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                    ),
                  },
                  {
                    label: t("listPrice"),
                    required: isRequiredField(
                      productCreateEditShema,
                      "listPrice"
                    ),
                    value: (
                      <TextField
                        fullWidth
                        id="listPrice"
                        name="listPrice"
                        type="number"
                        size="small"
                        value={formik.values.listPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.listPrice &&
                          Boolean(formik.errors.listPrice)
                        }
                        helperText={
                          <FormikErrorMessage
                            touched={formik.touched.listPrice}
                            error={formik.errors.listPrice}
                            translatedFieldName={t("listPrice")}
                          />
                        }
                      />
                    ),
                  },
                  {
                    label: t("threshold"),

                    value: (
                      <TextField
                        fullWidth
                        id="threshold"
                        name="threshold"
                        type="number"
                        size="small"
                        value={formik.values.threshold}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    ),
                  },
                  {
                    label: t("quantityPerCarton"),

                    value: (
                      <TextField
                        fullWidth
                        id="quantityPerCarton"
                        name="quantityPerCarton"
                        type="number"
                        size="small"
                        value={formik.values.quantityPerCarton}
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

export default ProductCreateEditPage;
