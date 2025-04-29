import Button from "@mui/material/Button";
import { DataList, DataTable, PbCard } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import {
  PbCardBody,
  PbCardHeader,
  PbCardTitle,
} from "components/platbricks/shared/PbCard";
import ValueFilter, {
  DataType,
  FilterChangeParam,
} from "components/platbricks/shared/ValueFilter";
import { useDatatableControls } from "hooks/useDatatableControls";
import { ClientCodeEnum } from "interfaces/enums/GlobalEnums";
import {
  InventoryDetailsDto,
  InventorySearchDto,
} from "interfaces/v12/inventory/inventory";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";
import { useLocationService } from "services/LocationService";
import { useProductService } from "services/ProductService";
import { useWarehouseService } from "services/WarehouseService";
import { useInventoryTable } from "./datatables/useInventoryTable";

function InventoryListPage() {
  const { t } = useTranslation();
  const [inventoryTable] = useInventoryTable();
  const InventoryService = useInventoryService();
  const ProductService = useProductService();
  const WarehouseService = useWarehouseService();
  const LocationService = useLocationService();

  const searchRef = useRef<InventorySearchDto>({
    page: 1,
    pageSize: 10,
  });

  const loadData = async (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    return InventoryService.searchInventorys(searchRef.current)
      .then((res: any) => res)
      .catch((err: any) => {
        console.error(err);
        return [];
      });
  };

  const loadDataCount = async (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    return InventoryService.countInventorys(searchRef.current)
      .then((res: any) => res)
      .catch((err: any) => {
        console.error(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls<InventoryDetailsDto>({
    initialData: [] as InventoryDetailsDto[],
    loadData,
    loadDataCount,
  });

  // On mount, load initial data
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("inventory")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("inventory") },
      ]}
      showSearch={true}
      renderSearch={() => (
        <PbCard sx={{ mb: 2 }}>
          <PbCardHeader>
            <PbCardTitle>{t("common:search")}</PbCardTitle>
          </PbCardHeader>
          <PbCardBody>
            <DataList
              md={12}
              mdLabel={2}
              hideDevider
              data={[
                {
                  label: t("product"),
                  value: (
                    <ValueFilter
                      placeholder={t("product")}
                      dataType={DataType.GUID}
                      onFilterChange={(filter: FilterChangeParam) => {
                        searchRef.current.productId = filter.valueMultiple.map(
                          (x) => x.value
                        );
                      }}
                      inValuesAsync={(
                        input: string,
                        page: number,
                        pageSize: number
                      ) =>
                        ProductService.getSelectOptions(input, page, pageSize)
                      }
                    />
                  ),
                },
                {
                  label: t("warehouse"),
                  value: (
                    <ValueFilter
                      placeholder={t("warehouse")}
                      dataType={DataType.GUID}
                      onFilterChange={(filter: FilterChangeParam) => {
                        searchRef.current.warehouseId =
                          filter.valueMultiple.map((x) => x.value);
                      }}
                      inValuesAsync={(
                        input: string,
                        page: number,
                        pageSize: number
                      ) =>
                        WarehouseService.getSelectOptions(input, page, pageSize)
                      }
                    />
                  ),
                },
                {
                  label: t("client-code"),
                  value: (
                    <ValueFilter
                      placeholder={t("client-code")}
                      dataType={DataType.ENUM}
                      onFilterChange={(filter: FilterChangeParam) => {
                        searchRef.current.clientCode = filter.valueMultiple.map(
                          (x) => x.value
                        );
                      }}
                      inValues={Object.values(ClientCodeEnum).map((p) => {
                        return {
                          value: p,
                          label: t(p),
                        };
                      })}
                    />
                  ),
                },
                {
                  label: t("rack"),
                  value: (
                    <ValueFilter
                      placeholder={t("rack")}
                      dataType={DataType.GUID}
                      onFilterChange={(filter: FilterChangeParam) => {
                        searchRef.current.locationId = filter.valueMultiple.map(
                          (x) => x.value
                        );
                      }}
                      inValuesAsync={(
                        input: string,
                        page: number,
                        pageSize: number
                      ) =>
                        LocationService.getSelectOptions(input, page, pageSize)
                      }
                    />
                  ),
                },
              ]}
            />
            <div style={{ textAlign: "right" }}>
              <Button variant="contained" onClick={() => reloadData()}>
                {t("common:search")}
              </Button>
            </div>
          </PbCardBody>
        </PbCard>
      )}
      hasSingleActionButton
    >
      <DataTable
        title={t("inventory")}
        tableKey="InventoryListPage-Inbound Deliveries"
        headerCells={inventoryTable}
        data={tableProps}
        dataKey="inventoryId"
        showSearch={true}
      />
    </Page>
  );
}

export default InventoryListPage;
