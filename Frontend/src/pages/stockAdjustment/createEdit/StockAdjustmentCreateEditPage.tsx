import { CardContent } from "@mui/material";
import {
  BadgeText,
  DataTable,
  NavBlocker,
  Page,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useFormikDatatable } from "hooks/useFormikDatatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useStockAdjustmentService } from "services/StockAdjustmentService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
  getFormikArrayElementErrors,
} from "utils/formikHelpers";
import { useStockAdjustmentItemTable } from "../datatables/useStockAdjustmentItemTable";
import StockAdjustmentHeadCreateEdit from "./components/StockAdjustmentHeadCreateEdit";
import StockAdjustmentItemCreateEdit from "./components/items/StockAdjustmentItemCreateEdit";
import {
  StockAdjustmentCreateEditSchema,
  YupStockAdjustmentCreateEdit,
} from "./yup/StockAdjustmentCreateEditSchema";

const StockAdjustmentCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const stockAdjustmentService = useStockAdjustmentService();

  const [stockAdjustment, setStockAdjustment] =
    useState<YupStockAdjustmentCreateEdit>({
      number: "",
      warehouseId: EMPTY_GUID as guid,
      locationId: EMPTY_GUID as guid,
      stockAdjustmentItems: [],
    });

  const [stockAdjustmentItemTable] = useStockAdjustmentItemTable();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-stock-adjustment");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("stock-adjustment"),
      to: "/stock-out",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("common:stock-out");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("stock-adjustment"),
        to: "/stock-adjustment",
      },
      {
        label: stockAdjustment.number as string,
        to: "/stock-adjustment/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockAdjustment,
    validationSchema: StockAdjustmentCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        stockAdjustmentService
          .createStockAdjustment(values)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-out",
              "created",
              "stockAdjustment",
              result
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(
              err.data,
              "stockAdjustment"
            );
          });
      } else {
        stockAdjustmentService
          .updateStockAdjustment(id as guid, values as any)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-out",
              "updated",
              "stockAdjustment",
              values.number as string
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(
              err.data,
              "stockAdjustment"
            );
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (id) {
      stockAdjustmentService
        .getStockAdjustmentById(id as guid)
        .then((stockAdjustment: any) => {
          stockAdjustment.stockAdjustmentItems.forEach(
            (x: any, i: any) => (x.key = i)
          );
          setStockAdjustment(stockAdjustment);

          updateStockAdjustmentItemsTableControls({
            data: stockAdjustment.stockAdjustmentItems.map(
              (a: any, b: any) => ({
                ...a,
                key: b,
              })
            ),
          });
          setPageReady(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPageReady(true);
    }
  }, [id]);
  /* eslint-enable */
  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      notificationService.handleErrorMessage(
        t("common:please-fix-the-errors-and-try-again")
      );
    }
  }, [
    formik.submitCount,
    formik.isValid,
    formik.isSubmitting,
    notificationService,
    t,
  ]);

  const {
    updateDatatableControls: updateStockAdjustmentItemsTableControls,
    tableProps: stockAdjustmentItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  const handleBlur = (...args: any) => {
    updateStockAdjustmentItemsTableControls({
      data: formik.values.stockAdjustmentItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
    formik.handleBlur.apply(null, args);
  };

  const {
    addHandler: addStockAdjustmentItemHandler,
    removeHandler: removeStockAdjustmentItemHandler,
  } = useFormikDatatable(
    formik,
    stockAdjustmentItemsTableProps.pageSize,
    updateStockAdjustmentItemsTableControls,
    "stockAdjustmentItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockAdjustmentItems:
          newValue ??
          formik.values.stockAdjustmentItems.map((x: any, i: any) => ({
            ...(formik.touched.stockAdjustmentItems?.[i] as any),
          })),
      });
    },
    () => {
      let key = formik.values.stockAdjustmentItems.length;

      return {
        key,
        productId: EMPTY_GUID as guid,
        quantity: 0,
      };
    }
  );

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
        navigate(`/stock-adjustment/${id}`);
      }, 100);
    }
  };

  const selectedStockAdjustmentItem =
    stockAdjustmentItemsTableProps.selections[0];

  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockAdjustment?.number?.toString() : ""}
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
            <PbTab
              label={t("common:details")}
              haserror={formikObjectHasHeadTouchedErrors(
                formik.errors,
                formik.touched
              )}
            />
            <PbTab
              label={
                <BadgeText
                  number={formik.values.stockAdjustmentItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockAdjustmentItems,
                formik.touched.stockAdjustmentItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <StockAdjustmentHeadCreateEdit
                formik={formik}
              ></StockAdjustmentHeadCreateEdit>
            </PbTabPanel>
            <PbTabPanel value={tab} index={1}>
              <DataTable
                title={t("common:items")}
                tableKey="StockAdjustmentCreateEditPage-Items"
                headerCells={stockAdjustmentItemTable}
                data={stockAdjustmentItemsTableProps}
                onAdd={addStockAdjustmentItemHandler}
                onDelete={(d) => removeStockAdjustmentItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>

        {tab === 1 && selectedStockAdjustmentItem !== undefined && (
          <StockAdjustmentItemCreateEdit
            key={selectedStockAdjustmentItem}
            elementKey={selectedStockAdjustmentItem}
            handleChange={formik.handleChange}
            handleBlur={handleBlur}
            values={
              formik.values.stockAdjustmentItems[selectedStockAdjustmentItem]
            }
            errors={getFormikArrayElementErrors(
              formik.errors.stockAdjustmentItems,
              selectedStockAdjustmentItem
            )}
            touched={
              formik.touched.stockAdjustmentItems?.[
                selectedStockAdjustmentItem
              ] || {}
            }
            formik={formik}
            parentElementName=""
            parentElementIndex={selectedStockAdjustmentItem}
          ></StockAdjustmentItemCreateEdit>
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockAdjustmentCreateEditPage;
