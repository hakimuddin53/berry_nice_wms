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
import {
  StockInCreateEditSchema,
  YupStockInItemsCreateEdit,
} from "../../yup/StockInCreateEditSchema";

const StockInItemCreateEdit: React.FC<
  EntityCreateEditChildComponentProps<YupStockInItemsCreateEdit>
> = (props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const LocationService = useLocationService();

  const [locationOptions, setLocationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const warehouseId = props.formik.values.warehouseId;
  // Whenever product or warehouse changes fetch active locations
  useEffect(() => {
    const productId = props.values.productId;
    if (productId && warehouseId) {
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
                    StockInCreateEditSchema,
                    "stockInItems[].productId"
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
                        name={`stockInItems.${props.elementKey}.productId`}
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
                            `stockInItems.${props.elementKey}.productId`,
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
                        id={`stockInItems.${props.elementKey}.locationId`}
                        name={`stockInItems.${props.elementKey}.locationId`}
                        value={props.values.locationId || ""}
                        onChange={(e) =>
                          props.formik.setFieldValue(
                            `stockInItems.${props.elementKey}.locationId`,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched(
                            `stockInItems.${props.elementKey}.locationId`
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
                    StockInCreateEditSchema,
                    "stockInItems[].quantity"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockInItems.${props.elementKey}.quantity`}
                      name={`stockInItems.${props.elementKey}.quantity`}
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
                {
                  label: t("unitPrice"),
                  required: isRequiredField(
                    StockInCreateEditSchema,
                    "stockInItems[].unitPrice"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockInItems.${props.elementKey}.unitPrice`}
                      name={`stockInItems.${props.elementKey}.unitPrice`}
                      size="small"
                      type="number"
                      value={props.values.unitPrice}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.unitPrice &&
                        Boolean(props.errors.unitPrice)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.unitPrice}
                          error={props.errors.unitPrice}
                          translatedFieldName={t("unitPrice")}
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
export default React.memo(StockInItemCreateEdit);
