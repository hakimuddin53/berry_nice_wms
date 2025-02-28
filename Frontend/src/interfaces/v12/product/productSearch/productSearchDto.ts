import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";

export interface ProductSearchDto extends PagedRequestAbstractDto {
  search: string;
}
