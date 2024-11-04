import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import TableFilters from "components/platbricks/shared/TableFilters";
import { useDatatableControls } from "hooks/useDatatableControls";
import { EventTypeEnum } from "interfaces/enums/EventSettingEnums";
import { SortOrderEnum } from "interfaces/general/pagedRequest/sortDto";
import { EventSettingDetailsV12Dto } from "interfaces/v12/eventSetting/eventSettingDetails/eventSettingDetailsV12Dto";
import {
  EventSettingSearchV12Dto,
  _EventSettingSortV12Dto,
} from "interfaces/v12/eventSetting/eventSettingSearch/eventSettingSearchV12Dto";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useEventSettingService } from "services/EventSettingService";
import { useEventSettingTable } from "./datatables/useEventSettingTable";
import useEventSettingTableFilters from "./tableFilters/useEventSettingTableFilters";

function EventSettingListPage() {
  const { t } = useTranslation("eventSetting");

  const [eventSettingTable] = useEventSettingTable();
  const EventSettingService = useEventSettingService();

  const { tableFilters, valueChangeHandler, search } =
    useEventSettingTableFilters();
  const filterSearch = useRef<EventSettingSearchV12Dto>({});

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    var sort: _EventSettingSortV12Dto = {};
    var sortField = eventSettingTable.find((x) => x.id === orderBy)?.sortField;
    if (sortField) {
      sort[sortField] = {
        sequence: 0,
        order: order === "asc" ? SortOrderEnum.ASC : SortOrderEnum.DESC,
      };
    }

    const searchOptions: EventSettingSearchV12Dto = {
      ...filterSearch.current,
      page: page + 1,
      pageSize,
      sort: sort,
    };

    //Add event search
    const eventSearch = Object.keys(EventTypeEnum)
      .filter((type) =>
        t(type, { ns: "enumerables" })
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
      .map((p) => p as EventTypeEnum);

    if (searchValue !== "") {
      if (searchOptions.event) {
        searchOptions.event.push({ values: eventSearch });
      } else {
        searchOptions.event = [{ values: eventSearch }];
      }
    }

    return searchOptions;
  };

  const loadData = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return EventSettingService.searchEventSettings(searchOptions);
  };

  const loadDataCount = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return EventSettingService.countEventSettings(searchOptions);
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as EventSettingDetailsV12Dto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    filterSearch.current = search;
    reloadData();
  }, [search, reloadData]);

  return (
    <Page
      title={t("event-settings")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("event-settings") },
      ]}
      hasSingleActionButton
      actions={[
        {
          title: t("new-event-setting"),
          icon: "Add",
          to: "new",
        },
      ]}
    >
      <TableFilters
        filters={tableFilters}
        onFilterValueChanged={valueChangeHandler}
      />
      <DataTable
        title={t("event-settings")}
        tableKey="EventSettingListPage-Event Settings"
        headerCells={eventSettingTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default EventSettingListPage;
