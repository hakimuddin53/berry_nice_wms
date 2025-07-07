// src/routes/StockInPrintPage.tsx
import { PDFViewer } from "@react-pdf/renderer";
import { StockInDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStockInService } from "services/StockInService";
import { useUserService } from "services/UserService";
import { useWarehouseService } from "services/WarehouseService";
import { EMPTY_GUID, guid } from "types/guid";
import { Print, ReportPdf } from "./ReportPdf";

const StockInPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stockInSvc = useStockInService();
  const whSvc = useWarehouseService();
  const userSvc = useUserService();

  const [data, setData] = useState<Print | null>(null);

  useEffect(() => {
    async function load() {
      const raw: StockInDetailsDto = await stockInSvc.getStockInById(guid(id!));
      // resolve display names
      const [warehouse, createdBy, changedBy] = await Promise.all([
        whSvc.getWarehouseById(raw.warehouseId).then((w) => w.name),
        userSvc
          .getUserById(guid(raw.createdById ?? EMPTY_GUID))
          .then((u) => u.name),
        userSvc
          .getUserById(guid(raw.changedById ?? EMPTY_GUID))
          .then((u) => u.name),
      ]);

      setData({
        number: raw.number,
        poNumber: raw.poNumber,
        warehouse,
        createdAt: raw.createdAt,
        createdBy,
        changedAt: raw.changedAt ?? "",
        changedBy,
        items: raw.stockInItems.map((i) => ({
          sku: "",
          description: "",
          quantity: i.quantity,
        })),
      });
    }
    load();
  }, [id, stockInSvc, whSvc, userSvc]);

  if (!data) return <div>Loading report…</div>;

  return (
    <PDFViewer width="100%" height="100vh" style={{ border: "none" }}>
      <ReportPdf data={data} />
    </PDFViewer>
  );
};

export default StockInPrintPage;
