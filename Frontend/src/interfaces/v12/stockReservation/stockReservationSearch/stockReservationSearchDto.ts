import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface StockReservationSearchDto extends PagedRequestAbstractDto {
  search: string;
}
