import { QRCodeSVG } from "qrcode.react";
import { forwardRef, useMemo } from "react";

export type BarcodeLabelData = {
  code: string;
  model?: string | null;
  ram?: string | null;
  storage?: string | null;
  processor?: string | null;
  screenSize?: string | null;
  remark?: string | null;
  warehouse?: string | null;
  serialNumber?: string | null;
  brand?: string | null;
  category?: string | null;
};

type BarcodeLabelProps = {
  data: BarcodeLabelData;
};

const BarcodeLabel = forwardRef<HTMLDivElement, BarcodeLabelProps>(
  ({ data }, ref) => {
    const isApple = useMemo(() => {
      const brand = data.brand?.toLowerCase() ?? "";
      const category = data.category?.toLowerCase() ?? "";
      return brand.includes("apple") || category.includes("apple");
    }, [data.brand, data.category]);

    const model = data.model?.trim() || data.code;
    const remarkText = data.remark?.trim() || "-";
    const serialText = data.serialNumber?.trim() || "";
    const warehouseText = data.warehouse?.trim() || "";

    const defaultLine1 = [data.ram, data.storage].filter(Boolean).join(" ");
    const defaultLine2 = [data.processor, data.screenSize]
      .filter(Boolean)
      .join(" ");

    const appleLine1 =
      data.storage?.trim() ||
      [data.ram, data.screenSize].filter(Boolean).join(" ");
    const appleLine2 = data.screenSize?.trim() || data.processor?.trim() || "";

    const line1 = isApple ? appleLine1 : defaultLine1;
    const line2 = isApple ? appleLine2 : defaultLine2;

    return (
      <div
        ref={ref}
        style={{
          width: "60mm",
          height: "30mm",
          padding: "2mm",
          boxSizing: "border-box",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: "18mm",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1mm",
          }}
        >
          <div style={{ width: "18mm", height: "18mm" }}>
            <QRCodeSVG
              value={data.code}
              size={64}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div style={{ fontSize: "7pt", textAlign: "center" }}>
            {warehouseText}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            paddingLeft: "2mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "1mm",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 ? (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          ) : null}
          {line2 ? (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line2}</div>
          ) : null}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText ? (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          ) : null}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </div>
      </div>
    );
  }
);

BarcodeLabel.displayName = "BarcodeLabel";

export default BarcodeLabel;
