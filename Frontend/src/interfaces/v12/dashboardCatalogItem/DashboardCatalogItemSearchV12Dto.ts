import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";
import {
  SearchGuidFilter,
  SearchStringFilter,
} from "interfaces/general/searchFilter/searchFilter";

export interface DashboardCatalogItemSearchV12Dto
  extends PagedRequestAbstractDto {
  id?: SearchGuidFilter[];
  chartTitle?: SearchStringFilter[];
  createdBy?: SearchGuidFilter[];
}
