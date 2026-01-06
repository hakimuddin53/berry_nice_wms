import { BarcodeLabelData } from "./BarcodeLabel";

/**
 * Build a ZPL label for 60mm x 30mm (about 480 x 240 dots at 203dpi).
 * This returns raw ZPL you can send directly to a Zebra-compatible printer
 * (or through Bartender as passthrough).
 */
export const buildZplLabel = (data: BarcodeLabelData) => {
  const sanitize = (value?: string | null) =>
    (value ?? "")
      // remove control chars
      .replace(/[\x00-\x1F\x7F]/g, "")
      // ZPL reserved chars
      .replace(/[\^~\\]/g, " ");

  const model = sanitize(data.model) || sanitize(data.code);
  const code = sanitize(data.code);
  const remark = sanitize(data.remark) || "-";
  const serial = sanitize(data.serialNumber);
  const warehouse = sanitize(data.warehouse);

  const defaultLine1 = [data.ram, data.storage].filter(Boolean).join(" ");
  const defaultLine2 = [data.processor, data.screenSize]
    .filter(Boolean)
    .join(" ");
  const apple =
    (data.brand ?? "").toLowerCase().includes("apple") ||
    (data.category ?? "").toLowerCase().includes("apple");
  const appleLine1 =
    sanitize(data.storage) ||
    [sanitize(data.ram), sanitize(data.screenSize)].filter(Boolean).join(" ");
  const appleLine2 = sanitize(data.screenSize) || sanitize(data.processor);
  const line1 = sanitize(apple ? appleLine1 : defaultLine1);
  const line2 = sanitize(apple ? appleLine2 : defaultLine2);

  // Layout (dots):
  // Label: 480w x 240h
  // QR: 140x140 at (10,10)
  // Text block starts at x=160
  return `
^XA
^CI28
^PW480
^LL240
^LH0,0

^FO10,10
^BQN,2,6
^FDLA,${code}^FS

^FO10,160^A0N,24,24^FB140,1,0,C^FD${warehouse}^FS

^FO160,10^A0N,34,34^FB300,1,0,L^FD${model}^FS
${line1 ? `^FO160,50^A0N,24,24^FB300,1,0,L^FD${line1}^FS` : ""}
${line2 ? `^FO160,80^A0N,24,24^FB300,1,0,L^FD${line2}^FS` : ""}
^FO160,110^A0N,26,26^FB300,1,0,L^FD${code}^FS
${serial ? `^FO160,140^A0N,24,24^FB300,1,0,L^FD${serial}^FS` : ""}
^FO160,170^A0N,22,22^FB300,2,0,L^FD${remark}^FS

^XZ
`.replace(/[ \t]+\n/g, "\n");
};

export default buildZplLabel;
