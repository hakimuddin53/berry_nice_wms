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
import {
  InventoryDetailsDto,
  InventorySearchDto,
} from "interfaces/v12/inventory/inventory";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import axios from "utils/axios";
import { useInventoryTable } from "./datatables/useInventoryTable";

function InventoryListPage() {
  const { t } = useTranslation();
  const [inventoryTable] = useInventoryTable();
  const InventoryService = useInventoryService();
  const ProductService = useProductService();
  const [pageBlocker, setPageBlocker] = useState(false);

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
    searchRef.current.page = page + 1; // Adjusting for 1-based index
    searchRef.current.pageSize = pageSize;
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

  const handleExport = async () => {
    try {
      setPageBlocker(true);
      const response = await axios.post(
        "/inventory/export",
        searchRef.current,
        {
          responseType: "blob",
        }
      );

      setPageBlocker(false);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `InventoryExport_${new Date().toISOString().slice(0, 10)}.xlsx`
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
      title={t("inventory")}
      showBackdrop={pageBlocker}
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
