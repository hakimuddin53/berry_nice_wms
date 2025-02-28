import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockTransferSearchDto extends PagedRequestAbstractDto {
  search: string;
}
