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

import { useProductService } from "services/ProductService";
import {
  StockInCreateEditSchema,
  YupStockInItemsCreateEdit,
} from "../../yup/StockInCreateEditSchema";

const StockInItemCreateEdit: React.FC<
  EntityCreateEditChildComponentProps<YupStockInItemsCreateEdit>
> = (props) => {
  const { t } = useTranslation("stockIn");
  const [tab, setTab] = useState(0);

  const ProductService = useProductService();

  return (
    <PageSection
      title={t("common:items")}
      subtitle={props.values.stockInItemNumber}
    >
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
                  label: t("common:item"),
                  required: isRequiredField(
                    StockInCreateEditSchema,
                    "stockInItems[].stockInItemNumber"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockInItems.${props.elementKey}.stockInItemNumber`}
                      name={`stockInItems.${props.elementKey}.stockInItemNumber`}
                      size="small"
                      value={props.values.stockInItemNumber}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.stockInItemNumber &&
                        Boolean(props.errors.stockInItemNumber)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.stockInItemNumber}
                          error={props.errors.stockInItemNumber}
                          translatedFieldName={t("common:item")}
                        />
                      }
                    />
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
                  label: t("list-price"),
                  required: isRequiredField(
                    StockInCreateEditSchema,
                    "stockInItems[].listPrice"
                  ),
                  value: (
                    <TextField
                      fullWidth
                      id={`stockInItems.${props.elementKey}.listPrice`}
                      name={`stockInItems.${props.elementKey}.listPrice`}
                      size="small"
                      value={props.values.listPrice}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.listPrice &&
                        Boolean(props.errors.listPrice)
                      }
                      helperText={
                        <FormikErrorMessage
                          touched={props.touched.listPrice}
                          error={props.errors.listPrice}
                          translatedFieldName={t("list-price")}
                        />
                      }
                    />
                  ),
                },

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
              ]}
            ></DataList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </PageSection>
  );
};
export default React.memo(StockInItemCreateEdit);
