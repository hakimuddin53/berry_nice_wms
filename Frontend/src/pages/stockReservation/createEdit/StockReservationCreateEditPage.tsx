import { CardContent } from "@mui/material";
import { BadgeText, DataTable } from "components/platbricks/shared";
import { NavBlocker } from "components/platbricks/shared/NavBlocker";
import Page from "components/platbricks/shared/Page";
import { PbCard } from "components/platbricks/shared/PbCard";
import { PbTab, PbTabPanel, PbTabs } from "components/platbricks/shared/PbTab";
import { FormikProvider, setNestedObjectValues, useFormik } from "formik";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useFormikDatatable } from "hooks/useFormikDatatable";
import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useStockReservationService } from "services/StockReservationService";
import { EMPTY_GUID, guid } from "types/guid";
import {
  formikObjectHasHeadTouchedErrors,
  formikObjectHasTouchedErrors,
  getFormikArrayElementErrors,
} from "utils/formikHelpers";
import { useStockReservationItemTable } from "../datatables/useStockReservationItemTable";
import StockReservationItemCreateEdit from "./components/items/StockReservationItemCreateEdit";
import StockReservationCreateEdit from "./components/StockReservationCreateEdit";
import {
  StockReservationCreateEditSchema,
  YupStockReservationCreateEdit,
} from "./yup/StockReservationCreateEditSchema";

// Compute initial dates once for new reservations
const getInitialReservation = (): YupStockReservationCreateEdit => {
  return {
    number: "",
    warehouseId: EMPTY_GUID as guid,
    reservedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    stockReservationItems: [],
    // add other fields as needed—for example, a default status
    status: ReservationStatusEnum.ACTIVE,
  };
};

const StockReservationCreateEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockReservationService = useStockReservationService();

  const [stockReservation, setStockReservation] =
    useState<YupStockReservationCreateEdit>(getInitialReservation());

  const [stockReservationItemTable] = useStockReservationItemTable();
  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);
  const navigate = useNavigate();
  const [pageReady, setPageReady] = useState<boolean>(false);

  let title = t("create-stock-reservation");

  let breadcrumbs = [
    { label: t("common:dashboard"), to: "/" },
    {
      label: t("stock-reservation"),
      to: "/stock-reservation",
    },
    { label: t("common:create") },
  ];

  const formik = useFormik({
    initialValues: stockReservation,
    validationSchema: StockReservationCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      // Set read-only dates just before submission
      const now = new Date();
      values.reservedAt = now.toISOString();
      values.expiresAt = new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString();
      values.status = ReservationStatusEnum.ACTIVE;
      setPageBlocker(true);

      if (!id) {
        StockReservationService.createStockReservation(values)
          .then((createdResult) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "stock-reservation",
              "created",
              "common"
            );

            navigateToDetails(createdResult);
          })
          .catch((err) => {
            setPageBlocker(false);
            notificationService.handleApiErrorMessage(err.data, "common");
          });
      } else {
        StockReservationService.updateStockReservation(
          id as guid,
          values as any
        )
          .then((result) => {
            resetForm({ values });
            setPageBlocker(false);

            notificationService.handleApiSuccessMessage(
              "stock-reservation",
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

  useEffect(() => {
    if (id) {
      StockReservationService.getStockReservationById(id as guid)
        .then((reservation: any) => {
          setStockReservation(reservation);
          updateStockReservationItemsTableControls({
            data: stockReservation.stockReservationItems.map(
              (a: any, b: any) => ({
                ...a,
                key: b,
              })
            ),
          });
          setPageReady(true);
        })
        .catch((err) => {});
    } else {
      setPageReady(true);
    }
  }, [id, StockReservationService]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      notificationService.handleErrorMessage(
        t("common:please-fix-the-errors-and-try-again")
      );
    }
  }, [
    formik.submitCount,
    formik.isSubmitting,
    formik.isValid,
    t,
    notificationService,
  ]);

  const {
    updateDatatableControls: updateStockReservationItemsTableControls,
    tableProps: stockReservationItemsTableProps,
  } = useDatatableControls({
    selectionMode: "single",
  });

  const handleBlur = (...args: any) => {
    updateStockReservationItemsTableControls({
      data: formik.values.stockReservationItems.map((a, b) => ({
        ...a,
        key: b,
      })),
    });
    formik.handleBlur.apply(null, args);
  };

  const {
    addHandler: addStockReservationItemHandler,
    removeHandler: removeStockReservationItemHandler,
  } = useFormikDatatable(
    formik,
    stockReservationItemsTableProps.pageSize,
    updateStockReservationItemsTableControls,
    "stockReservationItems",
    (newValue?: any) => {
      formik.setTouched({
        ...formik.touched,
        stockReservationItems:
          newValue ??
          formik.values.stockReservationItems.map((x: any, i: any) => ({
            ...(formik.touched.stockReservationItems?.[i] as any),
          })),
      });
    },
    () => {
      let key = formik.values.stockReservationItems.length;

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
        navigate(`/stock-reservation/${id}`);
      }, 100);
    }
  };

  const selectedStockReservationItem =
    stockReservationItemsTableProps.selections[0];

  if (id && !pageReady) {
    return <Page pagename={title} breadcrumbs={[]} title={"error"}></Page>;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      title={title}
      subtitle={id ? stockReservation.number ?? "" : ""}
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
                  number={formik.values.stockReservationItems.length}
                  label={t("common:items")}
                />
              }
              haserror={formikObjectHasTouchedErrors(
                formik.errors.stockReservationItems,
                formik.touched.stockReservationItems
              )}
            />
          </PbTabs>
          <CardContent>
            <PbTabPanel value={tab} index={0}>
              <StockReservationCreateEdit formik={formik} />
            </PbTabPanel>
            <PbTabPanel value={tab} index={1}>
              <DataTable
                title={t("common:items")}
                tableKey="StockReservationCreateEditPage-Items"
                headerCells={stockReservationItemTable}
                data={stockReservationItemsTableProps}
                onAdd={addStockReservationItemHandler}
                onDelete={(d) => removeStockReservationItemHandler(d)}
                dataKey="key"
                paddingEnabled={false}
              />
            </PbTabPanel>
          </CardContent>
        </PbCard>
        {tab === 1 && selectedStockReservationItem !== undefined && (
          <StockReservationItemCreateEdit
            key={selectedStockReservationItem}
            elementKey={selectedStockReservationItem}
            handleChange={formik.handleChange}
            handleBlur={handleBlur}
            values={
              formik.values.stockReservationItems[selectedStockReservationItem]
            }
            errors={getFormikArrayElementErrors(
              formik.errors.stockReservationItems,
              selectedStockReservationItem
            )}
            touched={
              formik.touched.stockReservationItems?.[
                selectedStockReservationItem
              ] || {}
            }
            formik={formik}
            parentElementName=""
            parentElementIndex={selectedStockReservationItem}
          ></StockReservationItemCreateEdit>
        )}
      </FormikProvider>
    </Page>
  );
};

export default StockReservationCreateEditPage;
