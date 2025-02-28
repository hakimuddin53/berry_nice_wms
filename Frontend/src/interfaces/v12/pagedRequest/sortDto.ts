export interface SortDto {
  sequence: number;
  order: SortOrderEnum;
}

export enum SortOrderEnum {
  ASC,
  DESC,
}
