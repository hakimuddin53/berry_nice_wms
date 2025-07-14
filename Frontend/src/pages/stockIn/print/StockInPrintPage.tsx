// src/routes/StockInPrintPage.tsx
import { PDFViewer } from "@react-pdf/renderer";
import { StockInDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInventoryService } from "services/InventoryService";
import { useLocationService } from "services/LocationService";
import { useProductService } from "services/ProductService";
import { useStockInService } from "services/StockInService";
import { useWarehouseService } from "services/WarehouseService";
import { guid } from "types/guid";
import { Print, ReportPdf } from "../../../components/ReportPdf";

const StockInPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stockInSvc = useStockInService();
  const whSvc = useWarehouseService();
  const productSvc = useProductService();
  const locationSvc = useLocationService();
  const inventorySvc = useInventoryService();

  const [data, setData] = useState<Print | null>(null);

  useEffect(() => {
    async function load() {
      const raw: StockInDetailsDto = await stockInSvc.getStockInById(guid(id!));

      // resolve display names
      const [warehouse] = await Promise.all([
        whSvc.getWarehouseById(raw.warehouseId).then((w) => w.name),
      ]);

      const items = await Promise.all(
        raw.stockInItems.map(async (i, idx) => {
          const product = await productSvc.getProductById(guid(i.productId!));

          // fetch size name and category name
          const [locationName, availableQty] = await Promise.all([
            locationSvc.getLocationById(i.locationId).then((c) => c.name),
            inventorySvc
              .searchInventorySummary({
                productId: [i.productId],
                locationId: [i.locationId],
                warehouseId: [raw.warehouseId],
              })
              .then((res) => res[0]?.availableQuantity || 0),
          ]);

          return {
            no: idx + 1,
            itemCode: product.itemCode,
            itemName: product.name,
            stockGroup: product.cartonSize,
            color: product.colour,
            size: product.size,
            category: product.category,
            availableQty: availableQty,
            orderQty: i.quantity,
            location: locationName,
          };
        })
      );

      setData({
        slipNo: raw.number,
        orderNumber: raw.poNumber,
        location: raw.fromLocation,
        warehouse: warehouse,
        createdAt: raw.createdAt,
        createdBy: "",
        type: "Stock In",
        items: items,
      });
    }
    load();
  }, [id]);

  if (!data) return <div>Loading report…</div>;

  return (
    <PDFViewer style={{ width: "100%", height: "100%" }} showToolbar>
      <ReportPdf data={data} />
    </PDFViewer>
  );
};

export default StockInPrintPage;
