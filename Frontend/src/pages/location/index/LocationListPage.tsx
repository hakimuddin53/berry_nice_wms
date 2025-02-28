import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  LocationDetailsDto,
  LocationSearchDto,
} from "interfaces/v12/location/location";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocationService } from "services/LocationService";
import { useLocationTable } from "./datatables/useLocationTable";

function LocationListPage() {
  const { t } = useTranslation();

  const [locationTable] = useLocationTable();
  const LocationService = useLocationService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: LocationSearchDto = {
      search: searchValue,
      page: page + 1,
      pageSize,
    };

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
    return LocationService.searchLocations(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return [];
      });
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
    return LocationService.countLocations(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as LocationDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("location")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("location") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-location"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("location")}
        tableKey="LocationListPage-Inbound Deliveries"
        headerCells={locationTable}
        data={tableProps}
        dataKey="locationId"
        showSearch={true}
      />
    </Page>
  );
}

export default LocationListPage;
