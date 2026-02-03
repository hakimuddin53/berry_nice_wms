export interface LogbookEntryDto {
  id: string;
  dateUtc: string;
  barcode: string;
  productId?: string | null;
  productCode?: string | null;
  userName: string;
  purpose?: string | null;
  logbookStatusId: string;
  statusLabel?: string | null;
  statusChangedAt?: string;
  history?: LogbookStatusHistoryDto[];
}

export interface LogbookAvailabilityDto {
  productId: string;
  productCode: string;
  productName?: string | null;
  userName?: string | null;
  remark?: string | null;
  logbookStatusId?: string | null;
  statusLabel?: string | null;
  statusChangedAt?: string | null;
  logbookEntryId?: string | null;
}

export interface LogbookSearchDto {
  search?: string | null;
  logbookStatusId?: string | null;
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
  logbookStatusId: string;
}

export interface LogbookUpdateDto {
  dateUtc?: string | null;
  userName: string;
  purpose?: string | null;
  logbookStatusId: string;
}

export interface LogbookStatusHistoryDto {
  id: string;
  logbookStatusId: string;
  statusLabel?: string | null;
  remark?: string | null;
  userName: string;
  changedAt: string;
}
