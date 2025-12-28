import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockRecieveSearchDto extends PagedRequestAbstractDto {
  search: string;
}
