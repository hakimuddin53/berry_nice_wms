import {
  CardContent,
  FormControl,
  FormHelperText,
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
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  formikObjectHasHeadTouchedErrors,
  isRequiredField,
} from "utils/formikHelpers";

import { useLocationService } from "services/LocationService";
import { useProductService } from "services/ProductService";
import {
  StockAdjustmentCreateEditSchema,
  YupStockAdjustmentItemsCreateEdit,
} from "../../yup/StockAdjustmentCreateEditSchema";

const StockAdjustmentItemCreateEdit: React.FC<
  EntityCreateEditChildComponentProps<YupStockAdjustmentItemsCreateEdit>
> = (props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const LocationService = useLocationService();

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
                    StockAdjustmentCreateEditSchema,
                    "stockAdjustmentItems[].productId"
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
                        name={`stockAdjustmentItems.${props.elementKey}.productId`}
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
                            `stockAdjustmentItems.${props.elementKey}.productId`,
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
                  label: t("rack"),
                  required: isRequiredField(
                    StockAdjustmentCreateEditSchema,
                    "stockAdjustmentItems[].locationId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.locationId &&
                        Boolean(props.errors.locationId)
                      }
                    >
                      <SelectAsync2
                        name={`stockAdjustmentItems.${props.elementKey}.locationId`}
                        error={
                          props.touched.locationId &&
                          Boolean(props.errors.locationId)
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched("locationId")
                        }
                        ids={useMemo(
                          () =>
                            props.values.locationId
                              ? [props.values.locationId]
                              : [],
                          [props.values.locationId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockAdjustmentItems.${props.elementKey}.locationId`,
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: string[]
                        ) =>
                          LocationService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.locationId}
                          error={props.errors.locationId}
                          translatedFieldName={t("rack")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("quantity"),
                  required: isRequiredField(
                    StockAdjustmentCreateEditSchema,
                    "stockAdjustmentItems[].quantity"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockAdjustmentItems.${props.elementKey}.quantity`}
                      name={`stockAdjustmentItems.${props.elementKey}.quantity`}
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
                  label: t("reason"),
                  required: isRequiredField(
                    StockAdjustmentCreateEditSchema,
                    "stockAdjustmentItems[].reason"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockAdjustmentItems.${props.elementKey}.reason`}
                      name={`stockAdjustmentItems.${props.elementKey}.reason`}
                      size="small"
                      value={props.values.reason}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.reason && Boolean(props.errors.reason)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.reason}
                          error={props.errors.reason}
                          translatedFieldName={t("reason")}
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
export default React.memo(StockAdjustmentItemCreateEdit);
