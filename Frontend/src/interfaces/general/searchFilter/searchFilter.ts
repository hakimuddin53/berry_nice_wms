export enum SearchFilterTypeEnum {
  EQUALS = 0,
  NOT_EQUALS = 1,
  LIKE = 2,
  NOT_LIKE = 3,
  STARTS_WITH = 4,
  NOT_STARTS_WITH = 5,
  ENDS_WITH = 6,
  NOT_ENDS_WITH = 7,
  CONTAINS = 8,
  NOT_CONTAINS = 9,
  GREATER_THAN = 10,
  GREATER_THAN_OR_EQUALS = 11,
  LESS_THAN = 12,
  LESS_THAN_OR_EQUALS = 13,
  EXISTS_ANY = 14,
  EXISTS_ALL = 15,
  EXISTS_NONE = 16,
  STRING_GREATER_THAN_OR_EQUALS = 17,
  STRING_LESS_THAN_OR_EQUALS = 18,
}

export enum SearchNumberFilterTypeEnum {
  EQUALS = SearchFilterTypeEnum.EQUALS,
  GREATER_THAN = SearchFilterTypeEnum.GREATER_THAN,
  GREATER_THAN_OR_EQUALS = SearchFilterTypeEnum.GREATER_THAN_OR_EQUALS,
  LESS_THAN = SearchFilterTypeEnum.LESS_THAN,
  LESS_THAN_OR_EQUALS = SearchFilterTypeEnum.LESS_THAN_OR_EQUALS,
}
export const SearchStringFilterTypeEnum = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  STARTS_WITH: "STARTS_WITH",
  NOT_STARTS_WITH: "NOT_STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  NOT_ENDS_WITH: "NOT_ENDS_WITH",
  CONTAINS: "CONTAINS",
  NOT_CONTAINS: "NOT_CONTAINS",
  STRING_GREATER_THAN_OR_EQUALS: "STRING_GREATER_THAN_OR_EQUALS",
  STRING_LESS_THAN_OR_EQUALS: "STRING_LESS_THAN_OR_EQUALS",
};

export enum SearchExactFilterTypeEnum {
  EQUALS = SearchFilterTypeEnum.EQUALS,
  NOT_EQUALS = SearchFilterTypeEnum.NOT_EQUALS,
}

export enum SearchChildsFilterTypeEnum {
  EXISTS_ANY = SearchFilterTypeEnum.EXISTS_ANY,
  EXISTS_ALL = SearchFilterTypeEnum.EXISTS_ALL,
  EXISTS_NONE = SearchFilterTypeEnum.EXISTS_NONE,
}

export interface SearchFilter<T1, T2> {
  filterType?: T2;
  values: T1[];
}

/* eslint-disable @typescript-eslint/no-redeclare */
export type SearchStringFilterTypeEnum =
  typeof SearchStringFilterTypeEnum[keyof typeof SearchStringFilterTypeEnum];
/* eslint-enable */

export interface SearchEnumFilter<T1>
  extends SearchFilter<T1, SearchExactFilterTypeEnum> {}

export interface SearchStringFilter
  extends SearchFilter<string, SearchStringFilterTypeEnum> {}

export interface SearchIntFilter
  extends SearchFilter<number, SearchNumberFilterTypeEnum> {}

export interface SearchFloatFilter
  extends SearchFilter<number, SearchNumberFilterTypeEnum> {}

export interface SearchNullableFloatFilter
  extends SearchFilter<number, SearchNumberFilterTypeEnum> {}

export interface SearchDateTimeFilter
  extends SearchFilter<string | null, SearchNumberFilterTypeEnum> {}

export interface SearchGuidFilter
  extends SearchFilter<string | null, SearchExactFilterTypeEnum> {}

export interface SearchChildFilter<T> {
  filterType: SearchChildsFilterTypeEnum;
  childFilter: T;
}
