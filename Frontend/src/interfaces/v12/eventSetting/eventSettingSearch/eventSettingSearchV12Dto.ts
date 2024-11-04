import {
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";
import { PagedRequestAbstractDto } from "interfaces/general/pagedRequest/pagedRequestAbstractDto";
import { SortDto } from "interfaces/general/pagedRequest/sortDto";
import {
  SearchDateTimeFilter,
  SearchEnumFilter,
  SearchGuidFilter,
  SearchStringFilter,
} from "interfaces/general/searchFilter/searchFilter";

export interface EventSettingSearchV12Dto extends PagedRequestAbstractDto {
  locationId?: SearchGuidFilter[];
  eventSettingId?: SearchGuidFilter[];
  event?: SearchEnumFilter<EventTypeEnum>[];
  actionType?: SearchEnumFilter<EventActionTypeEnum>[];
  callbackUrl?: SearchStringFilter[];
  email?: SearchStringFilter[];
  emailLanguage?: SearchStringFilter[];
  createdAt?: SearchDateTimeFilter[];
  createdById?: SearchGuidFilter[];
  sort?: _EventSettingSortV12Dto;
}
export interface _EventSettingSortV12Dto {
  sequence?: SortDto;
  createdAt?: SortDto;
}
