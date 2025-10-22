export interface InvoiceSearchDto {
  search?: string;
  page: number;
  pageSize: number;
  fromDate?: string;
  toDate?: string;
}
