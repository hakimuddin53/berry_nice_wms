import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockInSearchDto extends PagedRequestAbstractDto {
  search: string;
}