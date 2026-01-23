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
import MessageDialog from "components/platbricks/shared/dialogs/MessageDialog";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useFormikDatatable } from "hooks/useFormikDatatable";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLookupService } from "services/LookupService";
import { useNotificationService } from "services/NotificationService";
import { useStockRecieveService } from "services/StockRecieveService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  extractApiErrorMessages,
  flattenFormikErrors,
} from "utils/errorDialogHelpers";
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

const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const isGuidString = (value?: any) =>
  typeof value === "string" && GUID_REGEX.test(value);

const toDateOnly = (value?: string) => {
  if (!value) return "";
  const datePart = value.split("T")[0];
  return datePart || value;
};

const createDefaultItem = (): YupStockRecieveItemCreateEdit => ({
  productCode: "",
  categoryId: EMPTY_GUID as guid,
  brandId: undefined,
  modelId: undefined,
  modelName: "",
  year: undefined,
  batteryHealth: null,
  colorId: undefined,
  storageId: undefined,
  ramId: undefined,
  processorId: undefined,
  screenSizeId: undefined,
  gradeId: undefined,
  gradeName: "",
  locationId: EMPTY_GUID as guid,
  locationName: "",
  locationLabel: "",
  serialNumber: "",
  regionId: EMPTY_GUID as guid,
  regionName: "",
  newOrUsedId: EMPTY_GUID as guid,
  newOrUsedName: "",
  retailSellingPrice: undefined,
  dealerSellingPrice: undefined,
  agentSellingPrice: undefined,
  cost: undefined,
  remark: "",
  internalRemark: "",
  receiveQuantity: 1,
  productName: "",
});

const StockRecieveCreateEditPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockRecieveService = useStockRecieveService();
  const lookupService = useLookupService();
  const notificationService = useNotificationService();
  const navigate = useNavigate();

  const [stockRecieveNumber, setStockRecieveNumber] = useState<string>("");
  const currentUserId = useMemo(() => {
    const token = window.localStorage.getItem("accessToken");
    if (!token) return "";
    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        decoded.nameid ||
        decoded.sub ||
        ""
      );
    } catch {
      return "";
    }
  }, []);

  const [stockRecieve, setStockRecieve] = useState<YupStockRecieveCreateEdit>({
    sellerInfo: "",
    purchaser: "",
    dateOfPurchase: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
    warehouseId: EMPTY_GUID as guid,
    stockRecieveItems: [],
  });

  const [StockRecieveItemTable] = useStockRecieveItemTable();
  const [pageBlocker, setPageBlocker] = useState(false);
  const [pageReady, setPageReady] = useState<boolean>(() => !id);
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    title: string;
    messages: string[];
  }>({ open: false, title: "", messages: [] });

  const buildStockRecievePayload = useCallback(
    (values: YupStockRecieveCreateEdit) => {
      const stockRecieveItems = values.stockRecieveItems.map((item) => {
        const sanitized: any = {
          ...item,
          receiveQuantity: item.receiveQuantity ?? 1,
        };

        delete sanitized.key;
        delete sanitized.locationName;
        delete sanitized.locationLabel;
        delete sanitized.productName;
        delete sanitized.gradeName;
        delete sanitized.regionName;
        delete sanitized.newOrUsedName;

        sanitized.gradeId = isGuidString(sanitized.gradeId)
          ? sanitized.gradeId
          : null;

        sanitized.regionId = isGuidString(sanitized.regionId)
          ? sanitized.regionId
          : null;

        sanitized.newOrUsedId = isGuidString(sanitized.newOrUsedId)
          ? sanitized.newOrUsedId
          : null;

        const parsedYear =
          typeof sanitized.year === "string"
            ? Number.parseInt(sanitized.year, 10)
            : sanitized.year;
        sanitized.year =
          Number.isFinite(parsedYear) && parsedYear ? parsedYear : null;

        const parsedBatteryHealth =
          typeof sanitized.batteryHealth === "string"
            ? Number.parseFloat(sanitized.batteryHealth)
            : sanitized.batteryHealth;
        sanitized.batteryHealth = Number.isFinite(parsedBatteryHealth)
          ? Math.min(100, Math.max(0, parsedBatteryHealth))
          : null;

        if (!sanitized.productCode) {
          delete sanitized.productCode;
        }

        return sanitized;
      });

      const { stockRecieveItems: _ignored, invoiceNumber, ...rest } = values;
      const trimmedInvoiceNumber = (invoiceNumber ?? "").trim();

      return {
        ...rest,
        invoiceNumber: trimmedInvoiceNumber || undefined,
        purchaser: rest.purchaser || currentUserId || "",
        StockRecieveItems: stockRecieveItems,
      };
    },
    [currentUserId]
  );

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
      console.log(payload);

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
            const messages = extractApiErrorMessages(err, t, "common");
            setErrorDialog({
              open: true,
              title: t("common:request-failed", {
                defaultValue: "Request failed",
              }),
              messages,
            });
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
            const messages = extractApiErrorMessages(err, t, "common");
            setErrorDialog({
              open: true,
              title: t("common:request-failed", {
                defaultValue: "Request failed",
              }),
              messages,
            });
          });
      }
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  const validationMessages = useMemo(
    () => flattenFormikErrors(formik.errors),
    [formik.errors]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const normalizeStockRecieveItems = (items: any[] = []) =>
    items.map((item: any, index: number) => {
      const {
        remarks: legacyRemark,
        StockRecieveItemRemarks,
        modelId,
        modelName,
        grade,
        gradeId,
        gradeName,
        year,
        batteryHealth,
        regionId,
        regionName,
        region,
        newOrUsedId,
        newOrUsedName,
        newOrUsed,
        ...rest
      } = item;

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

      const resolvedGradeId =
        (isGuidString(gradeId) && gradeId) ||
        (isGuidString(grade) && (grade as string)) ||
        "";
      const resolvedModelId = isGuidString(modelId) ? modelId : "";
      const resolvedGradeName =
        gradeName ?? (typeof grade === "string" ? grade : "");
      const resolvedRegionId =
        (isGuidString(regionId) && regionId) ||
        (isGuidString(region) && (region as string)) ||
        "";
      const resolvedRegionName =
        regionName ?? (typeof region === "string" ? region : "");
      const resolvedNewOrUsedId =
        (isGuidString(newOrUsedId) && newOrUsedId) ||
        (isGuidString(newOrUsed) && (newOrUsed as string)) ||
        "";
      const resolvedNewOrUsedName =
        newOrUsedName ?? (typeof newOrUsed === "string" ? newOrUsed : "");
      const resolvedLocationName =
        rest.locationName ?? rest.locationLabel ?? "";
      const resolvedYear =
        typeof year === "number"
          ? year
          : typeof year === "string" && year.trim().length > 0
          ? Number.parseInt(year, 10)
          : undefined;
      const resolvedBatteryHealth =
        typeof batteryHealth === "number"
          ? batteryHealth
          : typeof batteryHealth === "string" && batteryHealth.trim().length > 0
          ? Number.parseFloat(batteryHealth)
          : undefined;

      return {
        ...rest,
        key: index,
        year: Number.isFinite(resolvedYear) ? resolvedYear : undefined,
        batteryHealth: Number.isFinite(resolvedBatteryHealth)
          ? Math.min(100, Math.max(0, resolvedBatteryHealth!))
          : null,
        gradeId: resolvedGradeId ?? "",
        modelId: resolvedModelId ?? "",
        modelName: modelName ?? "",
        gradeName: resolvedGradeName ?? "",
        regionId: resolvedRegionId ?? "",
        regionName: resolvedRegionName ?? "",
        newOrUsedId: resolvedNewOrUsedId ?? "",
        newOrUsedName: resolvedNewOrUsedName ?? "",
        locationName: resolvedLocationName ?? "",
        locationLabel: rest.locationLabel ?? resolvedLocationName ?? "",
        productName: rest.productName ?? "",
        serialNumber: rest.serialNumber ?? "",
        remark: remarkText,
        internalRemark: rest.internalRemark ?? "",
        receiveQuantity: rest.receiveQuantity ?? 1,
      };
    });

  useEffect(() => {
    if (id) {
      StockRecieveService.getStockRecieveById(id as guid)
        .then(async (stockRecieveData: any) => {
          let stockRecieveItems = normalizeStockRecieveItems(
            stockRecieveData.stockRecieveItems ?? []
          );
          const {
            number: fetchedNumber,
            invoiceNumber,
            ...rest
          } = stockRecieveData;
          const restDto = rest as YupStockRecieveCreateEdit;
          const resolvedDateOfPurchase = toDateOnly(restDto.dateOfPurchase);
          const missingLocationIds = Array.from(
            new Set(
              stockRecieveItems
                .filter(
                  (item) =>
                    item.locationId && !item.locationName && !item.locationLabel
                )
                .map((item) => item.locationId as string)
            )
          );

          if (missingLocationIds.length > 0) {
            try {
              const options =
                (await lookupService.getSelectOptions(
                  LookupGroupKey.Location,
                  "",
                  1,
                  Math.max(missingLocationIds.length, 10),
                  missingLocationIds
                )) ?? [];
              const locationMap = Object.fromEntries(
                options
                  .filter((option) => option.value)
                  .map((option) => [
                    String(option.value),
                    option.label ?? String(option.value),
                  ])
              );

              stockRecieveItems = stockRecieveItems.map((item) => {
                if (item.locationName || item.locationLabel) {
                  return item;
                }
                const locationLabel = locationMap[item.locationId as string];
                if (!locationLabel) {
                  return item;
                }
                return {
                  ...item,
                  locationName: locationLabel,
                  locationLabel,
                };
              });
            } catch {
              // ignore lookup failures; fallback to id
            }
          }

          setStockRecieve({
            ...restDto,
            dateOfPurchase: resolvedDateOfPurchase || "",
            purchaser: restDto.purchaser || "",
            invoiceNumber: invoiceNumber || "",
            stockRecieveItems,
          });
          setStockRecieveNumber(fetchedNumber ?? "");

          updateStockRecieveItemsTableControls({
            data: stockRecieveItems,
          });
          setPageReady(true);
        })
        .catch((err) => {
          const messages = extractApiErrorMessages(err, t, "common");
          setErrorDialog({
            open: true,
            title: t("common:request-failed", {
              defaultValue: "Request failed",
            }),
            messages,
          });
          setPageReady(true);
        });
    }
  }, [id]);
  /* eslint-enable */

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      setErrorDialog({
        open: true,
        title: t("common:please-fix-the-errors-and-try-again", {
          defaultValue: "Please fix the errors and try again",
        }),
        messages: validationMessages,
      });
    }
  }, [
    formik.submitCount,
    formik.isValid,
    formik.isSubmitting,
    t,
    validationMessages,
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
    <>
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
      <MessageDialog
        open={errorDialog.open}
        title={
          errorDialog.title || t("common:error", { defaultValue: "Error" })
        }
        messages={errorDialog.messages}
        onClose={() => setErrorDialog((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default StockRecieveCreateEditPage;
