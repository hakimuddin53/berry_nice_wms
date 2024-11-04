export interface PagedListDto<T> {
  currentPage: number;
  pageSize: number;
  data: T[];
}
