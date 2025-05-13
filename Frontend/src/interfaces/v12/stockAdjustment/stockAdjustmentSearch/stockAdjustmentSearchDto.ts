import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockAdjustmentSearchDto extends PagedRequestAbstractDto {
  search: string;
}
