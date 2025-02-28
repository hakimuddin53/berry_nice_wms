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
import { useStockTransferService } from "services/StockTransferService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasTouchedErrors,
  getFormikArrayElementErrors,
} from "utils/formikHelpers";
import { useStockTransferItemTable } from "../datatables/useStockTransfertemTable";
import StockTransferItemCreateEdit from "./components/StockTransferItemCreateEdit";
import {
  StockTransferCreateEditSchema,
  YupStockTransferCreateEdit,
} from "./yup/StockTransferCreateEditSchema";

const StockTransferCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const stockTransferService = useStockTransferService();

  const [stockTransfer, setStockTransfer] =
    useState<YupStockTransferCreateEdit>({
      number: "",
      stockTransferItems: [],
    });

  const [stockTransferItemTable] = useStockTransferItemTable();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-stock-transfer");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("stock-transfer"),
      to: "/stock-transfer",
    },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("common:stock-transfer");

    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      {
        label: t("stock-transfer"),
        to: "/stock-transfer",
      },
      {
        label: stockTransfer.number as string,
        to: "/stock-transfer/" + id,
      },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockTransfer,
    validationSchema: StockTransferCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        stockTransferService
          .createStockTransfer(values)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-transfer",
              "created",
              "stockTransfer",
              result
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(
              err.data,
              "stockTransfer"
            );
          });
      } else {
        stockTransferService
          .updateStockTransfer(id as guid, values as any)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-transfer",
              "updated",
              "stockTransfer",
              values.number as string
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(
              err.data,
              "stockTransfer"
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
      stockTransferService
        .getStockTransferById(id as guid)
        .then((stockTransfer: any) => {
          stockTransfer.stockTransferItems.forEach(
            (x: any, i: any) => (x.key = i)
          );
          setStockTransfer(stockTransfer);

          updateStockTransferItemsTableControls({
            data: stockTransfer.stockTransferItems.map((a: any, b: any) => ({
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
    updateDatatableControls: updateStockTransferItemsTableControls,
    tableProps: stockTransferItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  const handleBlur = (...args: any) => {
    updateStockTransferItemsTableControls({
      data: formik.values.stockTransferItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
    formik.handleBlur.apply(null, args);
  };

  const {
    addHandler: addStockTransferItemHandler,
    removeHandler: removeStockTransferItemHandler,
  } = useFormikDatatable(
    formik,
    stockTransferItemsTableProps.pageSize,
    updateStockTransferItemsTableControls,
    "stockTransferItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockTransferItems:
          newValue ??
          formik.values.stockTransferItems.map((x: any, i: any) => ({
            ...(formik.touched.stockTransferItems?.[i] as any),
          })),
      });
    },
    () => {
      let key = formik.values.stockTransferItems.length;

      return {
        key,
        stockTransferItemNumber: "",
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
        navigate(`/stock-transfer/${id}`);
      }, 100);
    }
  };

  const selectedStockTransferItem = stockTransferItemsTableProps.selections[0];

  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockTransfer?.number?.toString() : ""}
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
              label={
                <BadgeText
                  number={formik.values.stockTransferItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockTransferItems,
                formik.touched.stockTransferItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <DataTable
                title={t("common:items")}
                tableKey="StockTransferCreateEditPage-Items"
                headerCells={stockTransferItemTable}
                data={stockTransferItemsTableProps}
                onAdd={addStockTransferItemHandler}
                onDelete={(d) => removeStockTransferItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>

        {tab === 0 && selectedStockTransferItem !== undefined && (
          <StockTransferItemCreateEdit
            key={selectedStockTransferItem}
            elementKey={selectedStockTransferItem}
            handleChange={formik.handleChange}
            handleBlur={handleBlur}
            values={formik.values.stockTransferItems[selectedStockTransferItem]}
            errors={getFormikArrayElementErrors(
              formik.errors.stockTransferItems,
              selectedStockTransferItem
            )}
            touched={
              formik.touched.stockTransferItems?.[selectedStockTransferItem] ||
              {}
            }
            formik={formik}
            parentElementName=""
            parentElementIndex={selectedStockTransferItem}
          ></StockTransferItemCreateEdit>
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockTransferCreateEditPage;
