import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockOutSearchDto extends PagedRequestAbstractDto {
  search: string;
}
