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
import { useStockInService } from "services/StockInService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
  getFormikArrayElementErrors,
} from "utils/formikHelpers";
import { useStockInItemTable } from "../datatables/useStockInItemTable";
import StockInHeadCreateEdit from "./components/StockInHeadCreateEdit";
import StockInItemCreateEdit from "./components/items/StockInItemCreateEdit";
import {
  StockInCreateEditSchema,
  YupStockInCreateEdit,
} from "./yup/StockInCreateEditSchema";

const StockInCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const stockInService = useStockInService();

  const [stockIn, setStockIn] = useState<YupStockInCreateEdit>({
    number: "",
    poNumber: "",
    warehouseId: EMPTY_GUID as guid,
    stockInItems: [],
  });

  const [stockInItemTable] = useStockInItemTable();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-stock-in");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("stock-in"),
      to: "/stock-in",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("common:stock-in");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("stock-in"),
        to: "/stock-in",
      },
      {
        label: stockIn.number as string,
        to: "/stock-in/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockIn,
    validationSchema: StockInCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      console.log(values);

      if (!id) {
        stockInService
          .createStockIn(values)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-in",
              "created",
              "stockIn",
              result
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "stockIn");
          });
      } else {
        stockInService
          .updateStockIn(id as guid, values as any)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-in",
              "updated",
              "stockIn",
              values.number as string
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "stockIn");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (id) {
      stockInService
        .getStockInById(id as guid)
        .then((stockIn: any) => {
          stockIn.stockInItems.forEach((x: any, i: any) => (x.key = i));
          setStockIn(stockIn);

          updateStockInItemsTableControls({
            data: stockIn.stockInItems.map((a: any, b: any) => ({
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
    updateDatatableControls: updateStockInItemsTableControls,
    tableProps: stockInItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  const handleBlur = (...args: any) => {
    updateStockInItemsTableControls({
      data: formik.values.stockInItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
    formik.handleBlur.apply(null, args);
  };

  const {
    addHandler: addStockInItemHandler,
    removeHandler: removeStockInItemHandler,
  } = useFormikDatatable(
    formik,
    stockInItemsTableProps.pageSize,
    updateStockInItemsTableControls,
    "stockInItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockInItems:
          newValue ??
          formik.values.stockInItems.map((x: any, i: any) => ({
            ...(formik.touched.stockInItems?.[i] as any),
          })),
      });
    },
    () => {
      let key = formik.values.stockInItems.length;

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
        navigate(`/stock-in/${id}`);
      }, 100);
    }
  };

  const selectedStockInItem = stockInItemsTableProps.selections[0];

  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockIn?.number?.toString() : ""}
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
                  number={formik.values.stockInItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockInItems,
                formik.touched.stockInItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <StockInHeadCreateEdit formik={formik}></StockInHeadCreateEdit>
            </PbTabPanel>
            <PbTabPanel value={tab} index={1}>
              <DataTable
                title={t("common:items")}
                tableKey="StockInCreateEditPage-Items"
                headerCells={stockInItemTable}
                data={stockInItemsTableProps}
                onAdd={addStockInItemHandler}
                onDelete={(d) => removeStockInItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>

        {tab === 1 && selectedStockInItem !== undefined && (
          <StockInItemCreateEdit
            key={selectedStockInItem}
            elementKey={selectedStockInItem}
            handleChange={formik.handleChange}
            handleBlur={handleBlur}
            values={formik.values.stockInItems[selectedStockInItem]}
            errors={getFormikArrayElementErrors(
              formik.errors.stockInItems,
              selectedStockInItem
            )}
            touched={formik.touched.stockInItems?.[selectedStockInItem] || {}}
            formik={formik}
            parentElementName=""
            parentElementIndex={selectedStockInItem}
          ></StockInItemCreateEdit>
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockInCreateEditPage;
