export interface LogbookEntryDto {
  id: string;
  dateUtc: string;
  barcode: string;
  productId?: string | null;
  productCode?: string | null;
  userName: string;
  purpose?: string | null;
  status: string;
  statusChangedAt?: string;
  history?: LogbookStatusHistoryDto[];
}

export interface LogbookAvailabilityDto {
  productId: string;
  productCode: string;
  productName?: string | null;
  userName?: string | null;
  remark?: string | null;
  status?: string | null;
  statusChangedAt?: string | null;
  logbookEntryId?: string | null;
}

export interface LogbookSearchDto {
  search?: string | null;
  status?: string | null;
  fromDateUtc?: string | null;
  toDateUtc?: string | null;
  page: number;
  pageSize: number;
}

export interface LogbookCreateDto {
  dateUtc?: string | null;
  barcode: string;
  productId?: string | null;
  userName: string;
  purpose?: string | null;
  status?: string | null;
}

export interface LogbookUpdateDto {
  dateUtc?: string | null;
  userName: string;
  purpose?: string | null;
  status?: string | null;
}

export interface LogbookStatusHistoryDto {
  id: string;
  status: string;
  remark?: string | null;
  userName: string;
  changedAt: string;
}
