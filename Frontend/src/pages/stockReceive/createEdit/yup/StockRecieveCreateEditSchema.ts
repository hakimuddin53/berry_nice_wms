import { EMPTY_GUID, guid } from "types/guid";
import * as yup from "yup";

export interface YupStockRecieveCreateEdit {
  sellerInfo: string;
  purchaser: string;
  dateOfPurchase: string;
  warehouseId: guid;
  stockRecieveItems: YupStockRecieveItemCreateEdit[];
}

export interface YupStockRecieveItemCreateEdit {
  productCode?: string;
  categoryId: guid;
  brandId?: guid;
  model?: string;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  gradeId: guid;
  gradeName?: string;
  locationId: guid;
  locationName?: string;
  serialNumber?: string;
  regionId?: guid;
  regionName?: string;
  newOrUsedId?: guid;
  newOrUsedName?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  remark?: string;
  internalRemark?: string;
  receiveQuantity: number;
  productName?: string;
}

const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const StockRecieveCreateEditSchema = yup.object().shape({
  sellerInfo: yup.string().required(),
  purchaser: yup.string().required(),
  dateOfPurchase: yup.string().required(),
  warehouseId: yup.string().required(),
  stockRecieveItems: yup
    .array()
    .of(
      yup.object().shape({
        categoryId: yup.string().required(),
        brandId: yup.string().nullable(),
        model: yup.string().nullable(),
        colorId: yup.string().nullable(),
        storageId: yup.string().nullable(),
        ramId: yup.string().nullable(),
        processorId: yup.string().nullable(),
        screenSizeId: yup.string().nullable(),
        gradeId: yup
          .string()
          .test(
            "valid-grade-id",
            "required",
            (value) => !!value && value !== EMPTY_GUID && GUID_REGEX.test(value)
          )
          .required(),
        locationId: yup
          .string()
          .test(
            "not-empty-guid",
            "required",
            (value) => !!value && value !== EMPTY_GUID
          )
          .required(),
        serialNumber: yup.string().required(),
        regionId: yup
          .string()
          .nullable()
          .test(
            "valid-region-id",
            "invalid",
            (value) =>
              value === null ||
              value === undefined ||
              value === "" ||
              GUID_REGEX.test(value)
          ),
        newOrUsedId: yup
          .string()
          .test(
            "not-empty-guid",
            "required",
            (value) => !!value && GUID_REGEX.test(value)
          )
          .required(),
        remark: yup.string().nullable(),
        internalRemark: yup.string().nullable(),
        cost: yup.number().min(0).required(),
        receiveQuantity: yup.number().min(1).required().default(1),
      })
    )
    .min(1, "At least one item is required"),
});
