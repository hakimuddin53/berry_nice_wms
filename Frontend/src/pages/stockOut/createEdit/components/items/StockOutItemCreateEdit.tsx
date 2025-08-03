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
  PageSection,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { EntityCreateEditChildComponentProps } from "interfaces/general/createEditPage/createEditComponentInterfaces";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  formikObjectHasHeadTouchedErrors,
  isRequiredField,
} from "utils/formikHelpers";

import { useLocationService } from "services/LocationService";
import { useProductService } from "services/ProductService";
import { useStockReservationService } from "services/StockReservationService";
import {
  StockOutCreateEditSchema,
  YupStockOutItemsCreateEdit,
} from "../../yup/StockOutCreateEditSchema";

const StockOutItemCreateEdit: React.FC<
  EntityCreateEditChildComponentProps<YupStockOutItemsCreateEdit>
> = (props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const LocationService = useLocationService();
  const ReservationService = useStockReservationService();

  const [reservationOptions, setReservationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [locationOptions, setLocationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const warehouseId = props.formik.values.warehouseId;

  // Whenever product or warehouse changes, fetch active reservations and locations
  useEffect(() => {
    const productId = props.values.productId;
    if (productId && warehouseId) {
      ReservationService.getActiveReservations(productId, warehouseId)
        .then((res) => {
          setReservationOptions(
            res.map((r: any) => ({
              value: r.reservationItemId, // the reservation‐item id
              label: `${r.number} (${r.quantity} pcs) expires ${new Date(
                r.expiresAt
              ).toLocaleDateString()}`,
            }))
          );
        })
        .catch(() => setReservationOptions([]));

      LocationService.getActiveLocations(productId, warehouseId)
        .then((res) => {
          setLocationOptions(
            res.map((r: any) => ({
              value: r.locationId, //
              label: r.quantity > 0 ? `${r.name} (${r.quantity} pcs)` : r.name,
            }))
          );
        })
        .catch(() => setLocationOptions([]));
    }
  }, [
    props.values.productId,
    props.values.locationId,
    warehouseId,
    LocationService,
    ReservationService,
  ]);

  return (
    <PageSection title={t("common:items")}>
      <PbCard px={2} pt={2}>
        <PbTabs
          value={tab}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
        >
          <PbTab
            label={t("common:details")}
            haserror={formikObjectHasHeadTouchedErrors(
              props.errors,
              props.touched
            )}
          />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <DataList
              hideDevider={true}
              data={[
                {
                  label: t("product"),
                  required: isRequiredField(
                    StockOutCreateEditSchema,
                    "stockOutItems[].productId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.productId &&
                        Boolean(props.errors.productId)
                      }
                    >
                      <SelectAsync2
                        name={`stockOutItems.${props.elementKey}.productId`}
                        error={
                          props.touched.productId &&
                          Boolean(props.errors.productId)
                        }
                        onBlur={() => props.formik.setFieldTouched("productId")}
                        ids={useMemo(
                          () =>
                            props.values.productId
                              ? [props.values.productId]
                              : [],
                          [props.values.productId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockOutItems.${props.elementKey}.productId`,
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: string[]
                        ) =>
                          ProductService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.productId}
                          error={props.errors.productId}
                          translatedFieldName={t("product")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("reservation"),
                  required: false,
                  value: (
                    <FormControl
                      fullWidth
                      size="small"
                      error={
                        props.touched.reservationItemId &&
                        Boolean(props.errors.reservationItemId)
                      }
                    >
                      <Select
                        labelId={`reservation-label-${props.elementKey}`}
                        id={`stockOutItems.${props.elementKey}.reservationItemId`}
                        name={`stockOutItems.${props.elementKey}.reservationItemId`}
                        value={props.values.reservationItemId || ""}
                        onChange={(e) =>
                          props.formik.setFieldValue(
                            `stockOutItems.${props.elementKey}.reservationItemId`,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched(
                            `stockOutItems.${props.elementKey}.reservationItemId`
                          )
                        }
                      >
                        {reservationOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.reservationItemId}
                          error={props.errors.reservationItemId}
                          translatedFieldName={t("reservation")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("location"),
                  required: false,
                  value: (
                    <FormControl
                      fullWidth
                      size="small"
                      error={
                        props.touched.locationId &&
                        Boolean(props.errors.locationId)
                      }
                    >
                      <Select
                        labelId={`location-label-${props.elementKey}`}
                        id={`stockOutItems.${props.elementKey}.locationId`}
                        name={`stockOutItems.${props.elementKey}.locationId`}
                        value={props.values.locationId || ""}
                        onChange={(e) =>
                          props.formik.setFieldValue(
                            `stockOutItems.${props.elementKey}.locationId`,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched(
                            `stockOutItems.${props.elementKey}.locationId`
                          )
                        }
                      >
                        {locationOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.locationId}
                          error={props.errors.locationId}
                          translatedFieldName={t("location")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("quantity"),
                  required: isRequiredField(
                    StockOutCreateEditSchema,
                    "stockOutItems[].quantity"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockOutItems.${props.elementKey}.quantity`}
                      name={`stockOutItems.${props.elementKey}.quantity`}
                      size="small"
                      type="number"
                      value={props.values.quantity}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.quantity && Boolean(props.errors.quantity)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.quantity}
                          error={props.errors.quantity}
                          translatedFieldName={t("quantity")}
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
    </PageSection>
  );
};
export default React.memo(StockOutItemCreateEdit);
