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
import StockInItemCreateEdit from "./items/StockInItemCreateEdit";
import {
  stockInCreateEditSchema,
  YupStockInCreateEdit,
  YupStockInItemCreateEdit,
} from "./yup/stockInCreateEditSchema";

const createDefaultItem = (): YupStockInItemCreateEdit => ({
  productId: EMPTY_GUID as guid,
  productCode: "",
  categoryId: EMPTY_GUID as guid,
  brandId: undefined,
  model: "",
  colorId: undefined,
  storageId: undefined,
  ramId: undefined,
  processorId: undefined,
  screenSizeId: undefined,
  locationId: EMPTY_GUID as guid,
  primarySerialNumber: "",
  manufactureSerialNumber: "",
  region: "",
  condition: "",
  retailSellingPrice: undefined,
  dealerSellingPrice: undefined,
  agentSellingPrice: undefined,
  cost: undefined,
  stockInItemRemarks: [],
  itemsIncluded: "",
  receiveQuantity: 1,
});

const StockInCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const stockInService = useStockInService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [stockIn, setStockIn] = useState<YupStockInCreateEdit>({
    number: "",
    sellerInfo: "",
    purchaser: "",
    location: "",
    dateOfPurchase: new Date().toISOString().split("T")[0],
    warehouseId: EMPTY_GUID as guid,
    stockInItems: [],
  });

  const [stockInItemTable] = useStockInItemTable();
  const [pageBlocker, setPageBlocker] = useState(false);
  const [pageReady, setPageReady] = useState<boolean>(() => !id);

  let title = t("create-stock-in");
  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    { label: t("stock-in"), to: "/stock-in" },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("edit-stock-in");
    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      { label: t("stock-in"), to: "/stock-in" },
      { label: stockIn.number as string, to: "/stock-in/" + id },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockIn,
    validationSchema: stockInCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);

      if (!id) {
        stockInService
          .createStockIn(values)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-in",
              "created",
              "common"
            );

            navigateToDetails(result);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      } else {
        stockInService
          .updateStockIn(id as guid, values as any)
          .then(() => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-in",
              "updated",
              "common"
            );

            navigateToDetails(id);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const normalizeStockInItems = (items: any[] = []) =>
    items.map((item: any, index: number) => {
      const { remarks: legacyRemark, ...rest } = item;

      const rawRemarks = Array.isArray(item.stockInItemRemarks)
        ? item.stockInItemRemarks
        : legacyRemark
        ? [{ remark: legacyRemark }]
        : [];

      const stockInItemRemarks = rawRemarks.map((remark: any) => ({
        id: remark.id,
        stockInItemId: remark.stockInItemId,
        remark: remark.remark ?? remark.text ?? "",
      }));

      return {
        ...rest,
        key: index,
        stockInItemRemarks,
      };
    });

  useEffect(() => {
    if (id) {
      stockInService
        .getStockInById(id as guid)
        .then((stockInData: any) => {
          const stockInItems = normalizeStockInItems(
            stockInData.stockInItems ?? []
          );
          setStockIn({
            ...stockInData,
            stockInItems,
          });

          updateStockInItemsTableControls({
            data: stockInItems,
          });
          setPageReady(true);
        })
        .catch((err) => {
          console.log(err);
          setPageReady(true);
        });
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
    createDefaultItem
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
              <StockInHeadCreateEdit formik={formik} />
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
            formik={formik}
            itemIndex={selectedStockInItem}
          />
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockInCreateEditPage;
