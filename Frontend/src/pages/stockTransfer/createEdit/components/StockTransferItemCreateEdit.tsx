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
import { useLocationService } from "services/LocationService";
import { useProductService } from "services/ProductService";
import { useWarehouseService } from "services/WarehouseService";
import {
  formikObjectHasHeadTouchedErrors,
  isRequiredField,
} from "utils/formikHelpers";
import {
  StockTransferCreateEditSchema,
  YupStockTransferItemsCreateEdit,
} from "../yup/StockTransferCreateEditSchema";

const StockTransferItemCreateEdit: React.FC<
  EntityCreateEditChildComponentProps<YupStockTransferItemsCreateEdit>
> = (props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();
  const WarehouseService = useWarehouseService();
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
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].productId"
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
                        name={`stockTransferItems.${props.elementKey}.productId`}
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
                            `stockTransferItems.${props.elementKey}.productId`,
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
                  label: t("quantity"),
                  required: isRequiredField(
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].quantityTransferred"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockTransferItems.${props.elementKey}.quantityTransferred`}
                      name={`stockTransferItems.${props.elementKey}.quantityTransferred`}
                      size="small"
                      value={props.values.quantityTransferred}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.quantityTransferred &&
                        Boolean(props.errors.quantityTransferred)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.quantityTransferred}
                          error={props.errors.quantityTransferred}
                          translatedFieldName={t("quantity")}
                        />
                      }
                    />
                  ),
                },
                {
                  label: t("source-warehouse"),
                  required: isRequiredField(
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].fromWarehouseId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.fromWarehouseId &&
                        Boolean(props.errors.fromWarehouseId)
                      }
                    >
                      <SelectAsync2
                        name={`stockTransferItems.${props.elementKey}.fromWarehouseId`}
                        error={
                          props.touched.fromWarehouseId &&
                          Boolean(props.errors.fromWarehouseId)
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched("fromWarehouseId")
                        }
                        ids={useMemo(
                          () =>
                            props.values.fromWarehouseId
                              ? [props.values.fromWarehouseId]
                              : [],
                          [props.values.fromWarehouseId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockTransferItems.${props.elementKey}.fromWarehouseId`,
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: string[]
                        ) =>
                          WarehouseService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.fromWarehouseId}
                          error={props.errors.fromWarehouseId}
                          translatedFieldName={t("source-warehouse")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("source-location"),
                  required: isRequiredField(
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].fromLocationId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.fromLocationId &&
                        Boolean(props.errors.fromLocationId)
                      }
                    >
                      <SelectAsync2
                        name={`stockTransferItems.${props.elementKey}.fromLocationId`}
                        error={
                          props.touched.fromLocationId &&
                          Boolean(props.errors.fromLocationId)
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched("fromLocationId")
                        }
                        ids={useMemo(
                          () =>
                            props.values.fromLocationId
                              ? [props.values.fromLocationId]
                              : [],
                          [props.values.fromLocationId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockTransferItems.${props.elementKey}.fromLocationId`,
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
                          touched={props.touched.fromLocationId}
                          error={props.errors.fromLocationId}
                          translatedFieldName={t("source-location")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("destination-warehouse"),
                  required: isRequiredField(
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].toWarehouseId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.toWarehouseId &&
                        Boolean(props.errors.toWarehouseId)
                      }
                    >
                      <SelectAsync2
                        name={`stockTransferItems.${props.elementKey}.toWarehouseId`}
                        error={
                          props.touched.toWarehouseId &&
                          Boolean(props.errors.toWarehouseId)
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched("toWarehouseId")
                        }
                        ids={useMemo(
                          () =>
                            props.values.toWarehouseId
                              ? [props.values.toWarehouseId]
                              : [],
                          [props.values.toWarehouseId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockTransferItems.${props.elementKey}.toWarehouseId`,
                            newOption?.value || null
                          );
                        }}
                        asyncFunc={(
                          input: string,
                          page: number,
                          pageSize: number,
                          ids?: string[]
                        ) =>
                          WarehouseService.getSelectOptions(
                            input,
                            page,
                            pageSize,
                            ids
                          )
                        }
                      />
                      <FormHelperText>
                        <FormikErrorMessage
                          touched={props.touched.toWarehouseId}
                          error={props.errors.toWarehouseId}
                          translatedFieldName={t("destination-warehouse")}
                        />
                      </FormHelperText>
                    </FormControl>
                  ),
                },
                {
                  label: t("destination-location"),
                  required: isRequiredField(
                    StockTransferCreateEditSchema,
                    "stockTransferItems[].toLocationId"
                  ),
                  value: (
                    <FormControl
                      fullWidth
                      error={
                        props.touched.toLocationId &&
                        Boolean(props.errors.toLocationId)
                      }
                    >
                      <SelectAsync2
                        name={`stockTransferItems.${props.elementKey}.toLocationId`}
                        error={
                          props.touched.toLocationId &&
                          Boolean(props.errors.toLocationId)
                        }
                        onBlur={() =>
                          props.formik.setFieldTouched("toLocationId")
                        }
                        ids={useMemo(
                          () =>
                            props.values.toLocationId
                              ? [props.values.toLocationId]
                              : [],
                          [props.values.toLocationId]
                        )}
                        onSelectionChange={async (newOption) => {
                          props.formik.setFieldValue(
                            `stockTransferItems.${props.elementKey}.toLocationId`,
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
                          touched={props.touched.toLocationId}
                          error={props.errors.toLocationId}
                          translatedFieldName={t("destination-location")}
                        />
                      </FormHelperText>
                    </FormControl>
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
export default React.memo(StockTransferItemCreateEdit);
