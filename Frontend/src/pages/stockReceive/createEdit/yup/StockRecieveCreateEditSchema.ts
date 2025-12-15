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
  grade: string;
  locationId: guid;
  locationName?: string;
  imeiSerialNumber?: string;
  region?: string;
  newOrUsed?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  remark?: string;
  internalRemark?: string;
  receiveQuantity: number;
  productName?: string;
}

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
        grade: yup.string().required(),
        locationId: yup
          .string()
          .test(
            "not-empty-guid",
            "required",
            (value) => !!value && value !== EMPTY_GUID
          )
          .required(),
        imeiSerialNumber: yup.string().required(),
        region: yup.string().nullable(),
        newOrUsed: yup.string().required(),
        remark: yup.string().nullable(),
        internalRemark: yup.string().nullable(),
        cost: yup.number().min(0).required(),
        receiveQuantity: yup.number().min(1).required().default(1),
      })
    )
    .min(1, "At least one item is required"),
});
