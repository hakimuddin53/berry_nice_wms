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
import { useStockOutService } from "services/StockOutService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
  getFormikArrayElementErrors,
} from "utils/formikHelpers";
import { useStockOutItemTable } from "../datatables/useStockOutItemTable";
import StockOutHeadCreateEdit from "./components/StockOutHeadCreateEdit";
import StockOutItemCreateEdit from "./components/items/StockOutItemCreateEdit";
import {
  StockOutCreateEditSchema,
  YupStockOutCreateEdit,
} from "./yup/StockOutCreateEditSchema";

const StockOutCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const stockOutService = useStockOutService();

  const [stockOut, setStockOut] = useState<YupStockOutCreateEdit>({
    number: "",
    doNumber: "",
    warehouseId: EMPTY_GUID as guid,
    locationId: EMPTY_GUID as guid,
    stockOutItems: [],
  });

  const [stockOutItemTable] = useStockOutItemTable();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-stock-out");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("stock-out"),
      to: "/stock-out",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("common:stock-out");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("stock-out"),
        to: "/stock-out",
      },
      {
        label: stockOut.number as string,
        to: "/stock-out/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockOut,
    validationSchema: StockOutCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        stockOutService
          .createStockOut(values)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-out",
              "created",
              "stockOut",
              result
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "stockOut");
          });
      } else {
        stockOutService
          .updateStockOut(id as guid, values as any)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-out",
              "updated",
              "stockOut",
              values.number as string
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "stockOut");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (id) {
      stockOutService
        .getStockOutById(id as guid)
        .then((stockOut: any) => {
          stockOut.stockOutItems.forEach((x: any, i: any) => (x.key = i));
          setStockOut(stockOut);

          updateStockOutItemsTableControls({
            data: stockOut.stockOutItems.map((a: any, b: any) => ({
              ...a,
              key: b,
            })),
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
    updateDatatableControls: updateStockOutItemsTableControls,
    tableProps: stockOutItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  const handleBlur = (...args: any) => {
    updateStockOutItemsTableControls({
      data: formik.values.stockOutItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
    formik.handleBlur.apply(null, args);
  };

  const {
    addHandler: addStockOutItemHandler,
    removeHandler: removeStockOutItemHandler,
  } = useFormikDatatable(
    formik,
    stockOutItemsTableProps.pageSize,
    updateStockOutItemsTableControls,
    "stockOutItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockOutItems:
          newValue ??
          formik.values.stockOutItems.map((x: any, i: any) => ({
            ...(formik.touched.stockOutItems?.[i] as any),
          })),
      });
    },
    () => {
      let key = formik.values.stockOutItems.length;

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
        navigate(`/stock-out/${id}`);
      }, 100);
    }
  };

  const selectedStockOutItem = stockOutItemsTableProps.selections[0];

  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockOut?.number?.toString() : ""}
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
                  number={formik.values.stockOutItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockOutItems,
                formik.touched.stockOutItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <StockOutHeadCreateEdit formik={formik}></StockOutHeadCreateEdit>
            </PbTabPanel>
            <PbTabPanel value={tab} index={1}>
              <DataTable
                title={t("common:items")}
                tableKey="StockOutCreateEditPage-Items"
                headerCells={stockOutItemTable}
                data={stockOutItemsTableProps}
                onAdd={addStockOutItemHandler}
                onDelete={(d) => removeStockOutItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>

        {tab === 1 && selectedStockOutItem !== undefined && (
          <StockOutItemCreateEdit
            key={selectedStockOutItem}
            elementKey={selectedStockOutItem}
            handleChange={formik.handleChange}
            handleBlur={handleBlur}
            values={formik.values.stockOutItems[selectedStockOutItem]}
            errors={getFormikArrayElementErrors(
              formik.errors.stockOutItems,
              selectedStockOutItem
            )}
            touched={formik.touched.stockOutItems?.[selectedStockOutItem] || {}}
            formik={formik}
            parentElementName=""
            parentElementIndex={selectedStockOutItem}
          ></StockOutItemCreateEdit>
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockOutCreateEditPage;
