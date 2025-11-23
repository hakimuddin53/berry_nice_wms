export interface PagedListDto<T> {
  currentPage: number;
  pageSize: number;
  totalCount?: number;
  data: T[];
}
