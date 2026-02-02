import { QRCodeSVG } from "qrcode.react";
import { forwardRef, useMemo } from "react";

export type ProductType =
  | "tablet"
  | "watch"
  | "phone"
  | "laptop"
  | "accessory"
  | "default";

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
  type?: ProductType | string | null;
  year?: string | null;
  region?: string | null;
  batteryHealth?: string | null;
  ios?: string | null;
  grade?: string | number | null;
};

type BarcodeLabelProps = {
  data: BarcodeLabelData;
};

const BarcodeLabel = forwardRef<HTMLDivElement, BarcodeLabelProps>(
  ({ data }, ref) => {
    const productType = useMemo(() => {
      const type = data.type?.toLowerCase() ?? "";
      const category = data.category?.toLowerCase() ?? "";
      const brand = data.brand?.toLowerCase() ?? "";

      // Determine product type from type, category, or brand
      if (type.includes("tablet") || category.includes("tablet"))
        return "tablet";
      if (type.includes("watch") || category.includes("watch")) return "watch";
      if (type.includes("phone") || category.includes("phone")) return "phone";
      if (type.includes("laptop") || category.includes("laptop"))
        return "laptop";
      if (
        type.includes("accessory") ||
        type.includes("accessories") ||
        category.includes("accessory") ||
        category.includes("accessories")
      )
        return "accessory";

      return "default";
    }, [data.type, data.category, data.brand]);

    const isApple = useMemo(() => {
      const brand = data.brand?.toLowerCase() ?? "";
      const category = data.category?.toLowerCase() ?? "";
      return brand.includes("apple") || category.includes("apple");
    }, [data.brand, data.category]);

    const model = data.model?.trim() || data.code;
    const remarkText = data.remark?.trim() || "-";
    const serialText = data.serialNumber?.trim() || "";
    const warehouseText = data.warehouse?.trim() || "";

    // Render different label layouts based on product type
    const renderLabelContent = () => {
      switch (productType) {
        case "tablet":
          return renderTabletLabel();
        case "watch":
          return renderWatchLabel();
        case "phone":
          return renderPhoneLabel();
        case "laptop":
          return renderLaptopLabel();
        case "accessory":
          return renderAccessoryLabel();
        default:
          return renderDefaultLabel();
      }
    };

    const renderTabletLabel = () => {
      const line1 = [data.screenSize, data.year].filter(Boolean).join(" ");
      const line2 = [data.ram, data.storage].filter(Boolean).join(" ");
      const line3 = data.processor?.trim() || "";

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          {line2 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line2}</div>
          )}
          {line3 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line3}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderWatchLabel = () => {
      const line1 = [data.screenSize, "GPS"].filter(Boolean).join(" ");
      const batteryInfo = data.batteryHealth ? `BH:${data.batteryHealth}` : "";

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          {batteryInfo && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>
              {batteryInfo}
            </div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderPhoneLabel = () => {
      const line1 = [data.ram, data.storage].filter(Boolean).join(" ");
      const batteryInfo = data.batteryHealth
        ? `BH:${data.batteryHealth}${data.ios ? `, iOS:${data.ios}` : ""}`
        : "";

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          {batteryInfo && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>
              {batteryInfo}
            </div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderLaptopLabel = () => {
      const line1 = [data.screenSize, data.year].filter(Boolean).join(" ");
      const line2 = [data.ram, data.storage].filter(Boolean).join(" ");
      const line3 = data.processor?.trim() || "";

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          {line2 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line2}</div>
          )}
          {line3 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line3}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderAccessoryLabel = () => {
      const line1 = data.storage?.trim() || "";

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderDefaultLabel = () => {
      const defaultLine1 = [data.ram, data.storage].filter(Boolean).join(" ");
      const defaultLine2 = [data.processor, data.screenSize]
        .filter(Boolean)
        .join(" ");

      const appleLine1 =
        data.storage?.trim() ||
        [data.ram, data.screenSize].filter(Boolean).join(" ");
      const appleLine2 =
        data.screenSize?.trim() || data.processor?.trim() || "";

      const line1 = isApple ? appleLine1 : defaultLine1;
      const line2 = isApple ? appleLine2 : defaultLine2;

      return (
        <>
          <div style={{ fontSize: "9pt", fontWeight: 700, lineHeight: 1.1 }}>
            {model}
          </div>
          {line1 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line1}</div>
          )}
          {line2 && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{line2}</div>
          )}
          <div style={{ fontSize: "7pt", fontWeight: 700 }}>{data.code}</div>
          {serialText && (
            <div style={{ fontSize: "7pt", fontWeight: 600 }}>{serialText}</div>
          )}
          <div style={{ fontSize: "7pt" }}>{remarkText}</div>
        </>
      );
    };

    const renderRegionLogo = () => {
      const regionText = data.region?.trim() || "-";
      const gradeText = data.grade?.toString().trim() || "6";

      // Render region indicator with logo (similar to the circular logo in the images)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1mm",
          }}
        >
          {/* Circular logo with grade number */}
          <div
            style={{
              width: "11mm",
              height: "11mm",
              border: "2px solid #000",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "16pt",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {gradeText}
            </div>
          </div>
          {/* Region text below the logo */}
          <div
            style={{
              fontSize: "6pt",
              fontWeight: 600,
              textAlign: "center",
              marginTop: "-0.5mm",
            }}
          >
            {regionText}
          </div>
        </div>
      );
    };

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
          <div
            style={{ fontSize: "7pt", textAlign: "center", fontWeight: 600 }}
          >
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
          {renderLabelContent()}
        </div>
        <div
          style={{
            width: "12mm",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: "1mm",
          }}
        >
          {renderRegionLogo()}
        </div>
      </div>
    );
  }
);

BarcodeLabel.displayName = "BarcodeLabel";

export default BarcodeLabel;
