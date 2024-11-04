import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";
import { SortDto } from "interfaces/general/pagedRequest/sortDto";
import {
  SearchEnumFilter,
  SearchGuidFilter,
  SearchStringFilter,
} from "interfaces/general/searchFilter/searchFilter";

export interface DashboardSearchV12Dto extends PagedRequestAbstractDto {
  id?: SearchGuidFilter[];
  name?: SearchStringFilter[];
  isHomepage?: SearchEnumFilter<boolean>[];
  createdBy?: SearchGuidFilter[];
  sort?: DashboardSortV12Dto;
}

export interface DashboardSortV12Dto {
  name?: SortDto;
  createdAt?: SortDto;
  changedAt?: SortDto;
}
