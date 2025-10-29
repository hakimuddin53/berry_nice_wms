import { EMPTY_GUID, guid } from "types/guid";
import * as yup from "yup";

export interface YupStockInCreateEdit {
  number: string;
  sellerInfo: string;
  purchaser: string;
  dateOfPurchase: string;
  warehouseId: guid;
  stockInItems: YupStockInItemCreateEdit[];
}

export interface YupStockInItemRemarkCreateEdit {
  id?: guid;
  stockInItemId?: guid;
  remark: string;
}

export interface YupStockInItemCreateEdit {
  productCode: string;
  categoryId: guid;
  brandId?: guid;
  model?: string;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  locationId: guid;
  locationName?: string;
  primarySerialNumber?: string;
  manufactureSerialNumber?: string;
  region?: string;
  newOrUsed?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  stockInItemRemarks: YupStockInItemRemarkCreateEdit[];
  receiveQuantity: number;
  productName?: string;
}

const stockInItemRemarkSchema = yup.object().shape({
  id: yup.string().nullable(),
  stockInItemId: yup.string().nullable(),
  remark: yup.string().trim().required(),
});

export const stockInCreateEditSchema = yup.object().shape({
  number: yup.string().required(),
  sellerInfo: yup.string().required(),
  purchaser: yup.string().required(),
  dateOfPurchase: yup.string().required(),
  warehouseId: yup.string().required(),
  stockInItems: yup
    .array()
    .of(
      yup.object().shape({
        productCode: yup.string().required(),
        categoryId: yup.string().required(),
        brandId: yup.string().nullable(),
        model: yup.string().nullable(),
        colorId: yup.string().nullable(),
        storageId: yup.string().nullable(),
        ramId: yup.string().nullable(),
        processorId: yup.string().nullable(),
        screenSizeId: yup.string().nullable(),
        locationId: yup
          .string()
          .test(
            "not-empty-guid",
            "required",
            (value) => !!value && value !== EMPTY_GUID
          )
          .required(),
        region: yup.string().nullable(),
        newOrUsed: yup.string().nullable(),
        stockInItemRemarks: yup.array().of(stockInItemRemarkSchema).default([]),
        receiveQuantity: yup.number().min(1).required(),
      })
    )
    .min(1, "At least one item is required"),
});
