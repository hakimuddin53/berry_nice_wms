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
import { useStockRecieveService } from "services/StockRecieveService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
} from "utils/formikHelpers";
import { useStockRecieveItemTable } from "../datatables/useStockRecieveItemTable";
import StockRecieveHeadCreateEdit from "./components/StockRecieveHeadCreateEdit";
import StockRecieveItemCreateEdit from "./items/StockRecieveItemCreateEdit";
import {
  StockRecieveCreateEditSchema,
  YupStockRecieveCreateEdit,
  YupStockRecieveItemCreateEdit,
} from "./yup/StockRecieveCreateEditSchema";

const createDefaultItem = (): YupStockRecieveItemCreateEdit => ({
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
  locationName: "",
  imeiSerialNumber: "",
  region: "",
  newOrUsed: "",
  retailSellingPrice: undefined,
  dealerSellingPrice: undefined,
  agentSellingPrice: undefined,
  cost: undefined,
  remark: "",
  internalRemark: "",
  receiveQuantity: 1,
  productName: "",
});

const buildStockRecievePayload = (values: YupStockRecieveCreateEdit) => {
  const stockRecieveItems = values.stockRecieveItems.map((item) => {
    const sanitized: any = {
      ...item,
      receiveQuantity: item.receiveQuantity ?? 1,
    };

    delete sanitized.key;
    delete sanitized.locationName;
    delete sanitized.productName;
    delete sanitized.imeiSerialNumber;
    if (!sanitized.productCode) {
      delete sanitized.productCode;
    }

    return sanitized;
  });

  return {
    ...values,
    stockRecieveItems,
  };
};

const StockRecieveCreateEditPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockRecieveService = useStockRecieveService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [stockRecieveNumber, setStockRecieveNumber] = useState<string>("");
  const [stockRecieve, setStockRecieve] = useState<YupStockRecieveCreateEdit>({
    sellerInfo: "",
    purchaser: "",
    dateOfPurchase: new Date().toISOString().split("T")[0],
    warehouseId: EMPTY_GUID as guid,
    stockRecieveItems: [],
  });

  const [StockRecieveItemTable] = useStockRecieveItemTable();
  const [pageBlocker, setPageBlocker] = useState(false);
  const [pageReady, setPageReady] = useState<boolean>(() => !id);

  let title = t("create-stock-receive");
  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    { label: t("stock-receive"), to: "/stock-receive" },
    { label: t("common:create") },
  ];

  if (id) {
    title = t("edit-stock-receive");
    breadcrumbs = [
      { label: t("common:dashboard"), to: "/" },
      { label: t("stock-receive"), to: "/stock-receive" },
      { label: stockRecieveNumber || "", to: "/stock-receive/" + id },
      { label: t("common:edit") },
    ];
  }

  const formik = useFormik({
    initialValues: stockRecieve,
    validationSchema: StockRecieveCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setPageBlocker(true);
      const payload = buildStockRecievePayload(values);

      if (!id) {
        StockRecieveService.createStockRecieve(payload)
          .then((result) => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-receive",
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
        StockRecieveService.updateStockRecieve(id as guid, payload as any)
          .then(() => {
            setPageBlocker(false);
            resetForm({ values });

            notificationService.handleApiSuccessMessage(
              "stock-receive",
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
  const normalizeStockRecieveItems = (items: any[] = []) =>
    items.map((item: any, index: number) => {
      const { remarks: legacyRemark, StockRecieveItemRemarks, ...rest } = item;

      // Prefer the new single remark; else fallback to joining any legacy list/fields
      const remarkText =
        (typeof rest.remark === "string" && rest.remark) ||
        (Array.isArray(StockRecieveItemRemarks)
          ? StockRecieveItemRemarks.map((r: any) => r?.remark ?? r?.text)
              .filter((x: any) => typeof x === "string" && x.trim().length > 0)
              .join(", ")
          : typeof legacyRemark === "string"
          ? legacyRemark
          : "");

      return {
        ...rest,
        key: index,
        locationName: rest.locationName ?? "",
        productName: rest.productName ?? "",
        imeiSerialNumber: rest.imeiSerialNumber ?? "",
        remark: remarkText,
        internalRemark: rest.internalRemark ?? "",
        receiveQuantity: rest.receiveQuantity ?? 1,
      };
    });

  useEffect(() => {
    if (id) {
      StockRecieveService.getStockRecieveById(id as guid)
        .then((stockRecieveData: any) => {
          const stockRecieveItems = normalizeStockRecieveItems(
            stockRecieveData.stockRecieveItems ?? []
          );
          const { number: fetchedNumber, ...rest } = stockRecieveData;

          setStockRecieve({
            ...(rest as YupStockRecieveCreateEdit),
            stockRecieveItems,
          });
          setStockRecieveNumber(fetchedNumber ?? "");

          updateStockRecieveItemsTableControls({
            data: stockRecieveItems,
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
    updateDatatableControls: updateStockRecieveItemsTableControls,
    tableProps: stockRecieveItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  useEffect(() => {
    updateStockRecieveItemsTableControls({
      data: formik.values.stockRecieveItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
  }, [formik.values.stockRecieveItems, updateStockRecieveItemsTableControls]);

  const {
    addHandler: addStockRecieveItemHandler,
    removeHandler: removeStockRecieveItemHandler,
  } = useFormikDatatable(
    formik,
    stockRecieveItemsTableProps.pageSize,
    updateStockRecieveItemsTableControls,
    "stockRecieveItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockRecieveItems:
          newValue ??
          formik.values.stockRecieveItems.map((x: any, i: any) => ({
            ...(formik.touched.stockRecieveItems?.[i] as any),
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
        navigate(`/stock-receive/${id}`);
      }, 100);
    }
  };

  const selectedStockRecieveItem = stockRecieveItemsTableProps.selections[0];
  console.log(selectedStockRecieveItem);
  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockRecieveNumber : ""}
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
                  number={formik.values.stockRecieveItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockRecieveItems,
                formik.touched.stockRecieveItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <StockRecieveHeadCreateEdit formik={formik} />
            </PbTabPanel>
            <PbTabPanel value={tab} index={1}>
              <DataTable
                title={t("common:items")}
                tableKey="StockRecieveCreateEditPage-Items"
                headerCells={StockRecieveItemTable}
                data={stockRecieveItemsTableProps}
                onAdd={addStockRecieveItemHandler}
                onDelete={(d) => removeStockRecieveItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>

        {tab === 1 && selectedStockRecieveItem !== undefined && (
          <StockRecieveItemCreateEdit
            formik={formik}
            itemIndex={selectedStockRecieveItem}
          />
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockRecieveCreateEditPage;
