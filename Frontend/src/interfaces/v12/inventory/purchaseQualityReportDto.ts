export interface PurchaseQualityReportRowDto {
  purchaser: string;
  purchaseTotal: number;
  soldTotal: number;
  profit: number;
}

export interface PurchaseQualityReportSearchDto {
  search?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  page: number;
  pageSize: number;
}
