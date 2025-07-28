import { Button } from "@mui/material";
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
import {
  InventorySearchDto,
  InventorySummaryByProductDetailsDto,
} from "interfaces/v12/inventory/inventory";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useClientCodeService } from "services/ClientCodeService";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import { useWarehouseService } from "services/WarehouseService";
import axios from "utils/axios";
import { useInventoryByProductSummaryTable } from "./datatables/useInventoryByProductSummaryTable";

function InventorySummaryByProductListPage() {
  const { t } = useTranslation();
  const [summaryTable] = useInventoryByProductSummaryTable();
  const InventoryService = useInventoryService();
  const ProductService = useProductService();
  const WarehouseService = useWarehouseService();
  const ClientCodeService = useClientCodeService();

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
    searchRef.current.page = page + 1; // Adjusting for 1-based index
    searchRef.current.pageSize = pageSize;

    return InventoryService.searchInventorySummaryByProduct(searchRef.current)
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
    searchRef.current.page = page + 1; // Adjusting for 1-based index
    searchRef.current.pageSize = pageSize;

    return InventoryService.countInventorySummaryByProduct(searchRef.current)
      .then((res: any) => res)
      .catch((err: any) => {
        console.error(err);
        return 0;
      });
  };

  const { tableProps, reloadData } =
    useDatatableControls<InventorySummaryByProductDetailsDto>({
      initialData: [] as InventorySummaryByProductDetailsDto[],
      loadData,
      loadDataCount,
    });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const handleExport = async () => {
    try {
      const response = await axios.post(
        "/inventory/summary-product/export",
        searchRef.current,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `InventorySummaryExport_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting inventory:", error);
    }
  };

  return (
    <Page
      title={t("inventory-summary-by-product")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("inventory-summary-by-product") },
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
                      inValuesAsync={ProductService.getSelectOptions}
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
                      inValuesAsync={WarehouseService.getSelectOptions}
                    />
                  ),
                },
                {
                  label: t("client-code"),
                  value: (
                    <ValueFilter
                      placeholder={t("client-code")}
                      dataType={DataType.GUID}
                      onFilterChange={(filter: FilterChangeParam) => {
                        searchRef.current.clientCodeId =
                          filter.valueMultiple.map((x) => x.value);
                      }}
                      inValuesAsync={ClientCodeService.getSelectOptions}
                    />
                  ),
                },
              ]}
            />

            <div
              style={{
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExport()}
              >
                {t("common:export")}
              </Button>
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
        title={t("inventory-summary-by-product")}
        tableKey="InventorySummaryByProductListPage"
        headerCells={summaryTable}
        data={tableProps}
        dataKey="id"
        showSearch={true}
      />
    </Page>
  );
}

export default InventorySummaryByProductListPage;
