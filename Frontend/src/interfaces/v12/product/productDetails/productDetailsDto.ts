import { guid } from "types/guid";

export interface ProductDetailsDto {
  productId: guid;
  productCode: string;

  // Foreign keys
  categoryId: guid;
  brandId?: guid;
  colorId?: guid;
  storageId?: guid;
  ramId?: guid;
  processorId?: guid;
  screenSizeId?: guid;
  gradeId?: guid;
  modelId?: guid | null;
  model?: string | null;

  // Display names from lookups
  category: string;
  brand?: string;
  modelName?: string;
  year?: number | null;
  color?: string;
  storage?: string;
  ram?: string;
  processor?: string;
  screenSize?: string;
  gradeName?: string;
  serialNumber?: string | null;

  lowQty: number;
  createdDate: string;

  // Pricing and notes
  remark?: string | null;
  internalRemark?: string | null;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
  costPrice?: number | null;
  locationId?: guid | null;
  batteryHealth?: number | null;
}
