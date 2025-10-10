import { guid } from "types/guid";
import * as yup from "yup";

export interface YupStockInCreateEdit {
  number: string;
  sellerInfo: string;
  purchaser: string;
  location: string;
  dateOfPurchase: string;
  warehouseId: guid;
  stockInItems: YupStockInItemCreateEdit[];
}

export interface YupStockInItemCreateEdit {
  productId: guid;
  locationId: guid;
  primarySerialNumber?: string;
  manufactureSerialNumber?: string;
  region?: string;
  condition?: string;
  retailSellingPrice?: number;
  dealerSellingPrice?: number;
  agentSellingPrice?: number;
  cost?: number;
  remarks?: string;
  itemsIncluded?: string;
  receiveQuantity: number;
}

export const stockInCreateEditSchema = yup.object().shape({
  number: yup.string().required(),
  sellerInfo: yup.string().required(),
  purchaser: yup.string().required(),
  location: yup.string().required(),
  dateOfPurchase: yup.string().required(),
  warehouseId: yup.string().required(),
  stockInItems: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required(),
        locationId: yup.string().required(),
        receiveQuantity: yup.number().min(1).required(),
      })
    )
    .min(1, "At least one item is required"),
});
