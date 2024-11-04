import {
  TableFilter,
  TableFilterValue,
  isTableFilterValueDate,
} from "components/platbricks/shared/TableFilters";
import {
  EventActionTypeEnum,
  EventTypeEnum,
} from "interfaces/enums/EventSettingEnums";
import { SearchExactFilterTypeEnum } from "interfaces/general/searchFilter/searchFilter";
import { EventSettingSearchV12Dto } from "interfaces/v12/eventSetting/eventSettingSearch/eventSettingSearchV12Dto";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { guid } from "types/guid";

const useEventSettingTableFilters = () => {
  const { t } = useTranslation("eventSetting");
  const [search, setSearch] = useState<EventSettingSearchV12Dto>({});

  const tableFilters: TableFilter[] = [
    {
      key: "event",
      label: t("event"),
      type: "multiselect",
      options: Object.values(EventTypeEnum).map((p) => {
        return {
          value: p,
          label: t(p, { ns: "enumerables" }),
        };
      }),
    },

    {
      key: "action",
      label: t("action"),
      type: "multiselect",
      options: Object.values(EventActionTypeEnum).map((p) => {
        return {
          value: p,
          label: t(p, { ns: "enumerables" }),
        };
      }),
    },
  ];

  const valueChangeHandler = (filterValues: TableFilterValue[]) => {
    const newSearch: EventSettingSearchV12Dto = {};
    for (let filterValue of filterValues) {
      if (
        filterValue.value &&
        ((Array.isArray(filterValue.value) && filterValue.value.length > 0) ||
          (isTableFilterValueDate(filterValue.value) &&
            (filterValue.value.dateMax || filterValue.value.dateMin)))
      ) {
        switch (filterValue.key) {
          case "event":
            newSearch.event = [
              {
                filterType: SearchExactFilterTypeEnum.EQUALS,
                values: filterValue.value as EventTypeEnum[],
              },
            ];
            break;
          case "location":
            newSearch.locationId = [
              {
                filterType: SearchExactFilterTypeEnum.EQUALS,
                values: filterValue.value as guid[],
              },
            ];
            break;
          case "action":
            newSearch.actionType = [
              {
                filterType: SearchExactFilterTypeEnum.EQUALS,
                values: filterValue.value as EventActionTypeEnum[],
              },
            ];
            break;
        }
      }
    }
    setSearch(newSearch);
  };

  return { tableFilters, valueChangeHandler, search };
};

export default useEventSettingTableFilters;
