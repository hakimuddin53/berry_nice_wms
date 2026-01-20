import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import {
  calculateWarrantyExpiryDate,
  formatWarrantyExpiry,
  warrantyLabelFromMonths,
} from "utils/warranty";

const COMPANY_INFO = {
  name: "BERRY NICE SDN. BHD. (1495999-A)",
  addressLines: [
    "Level 2-16, 17&18, Second Floor, Laman Seri Harmoni (LSH33),",
    "No. 3, Jalan Batu Muda Tambahan 3, Sentul 51100, Kuala Lumpur.",
  ],
  phone: "03-27386721",
  bankLines: [
    "Berry Nice Sdn Bhd",
    "05101010255",
    "Hong Leong Bank (HLB)",
    "*Please click Instant Transfer/ Duit Now*",
    "*Once Transfer, Please do share the receipt*",
  ],
  warrantyLines: [
    "Water damage (inclusive waterproof model)",
    "Drop damage",
    "Phone / Device cannot on",
    "Warranty sticker broken or removed",
    "Screen cracked",
    "Touch problem",
    "Battery",
    "ID Lock / Forgot password",
    "Face ID / Fingerprint problem",
    "LCD issues (drop damage, no display, have line, dead pixel, screen burn etc)",
    "Warranty for NEW items with the respective Brands/Models",
  ],
};

const LOGO_BASE64 =
  "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";

type InvoicePrintOptions = {
  customerName?: string | null;
  customerAddress?: string | null;
  customerPhone?: string | null;
  productLabels?: Record<string, string>;
  getLocalDate?: (date: string) => string;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const displayProduct = (item: any, productLabels: Record<string, string>) =>
  item.productCode ||
  item.productName ||
  item.model ||
  item.brand ||
  (item.productId
    ? productLabels[item.productId as unknown as string]
    : undefined) ||
  item.productId ||
  "-";

export const buildInvoicePrintHtml = (
  invoice: InvoiceDetailsDto,
  options: InvoicePrintOptions = {}
) => {
  const productLabels = options.productLabels ?? {};
  const customerText =
    options.customerName ??
    invoice.customerName ??
    (invoice.customerId as unknown as string) ??
    "-";

  const customerAddress = options.customerAddress ?? "";
  const customerPhone = options.customerPhone ?? "";
  const salesRep = invoice.salesPersonName ?? invoice.salesPersonId ?? "-";
  const paymentType = invoice.paymentTypeName ?? "-";
  const normalizedSaleDate = invoice.dateOfSale.endsWith("Z")
    ? invoice.dateOfSale
    : `${invoice.dateOfSale}Z`;
  const longSaleDate = new Date(normalizedSaleDate).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
  const saleDateLabel = options.getLocalDate
    ? options.getLocalDate(invoice.dateOfSale)
    : new Date(normalizedSaleDate).toLocaleDateString();
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    invoice.number
  )}`;
  const logoSrc = `data:image/jpeg;base64,${LOGO_BASE64}`;

  const itemsHtml =
    invoice.invoiceItems.length > 0
      ? invoice.invoiceItems
          .map((item) => {
            const totalPrice =
              item.totalPrice || item.unitPrice * item.quantity;
            const warrantyDuration = warrantyLabelFromMonths(
              item.warrantyDurationMonths
            );
            const expiryIso =
              item.warrantyExpiryDate ??
              calculateWarrantyExpiryDate(
                invoice.dateOfSale,
                item.warrantyDurationMonths
              );
            const warrantyInfo =
              warrantyDuration || expiryIso
                ? `Warranty: ${warrantyDuration}${
                    expiryIso
                      ? ` (exp ${formatWarrantyExpiry(expiryIso) || ""})`
                      : ""
                  }`
                : "";
            const locationInfo =
              item.locationLabel || item.locationName
                ? `Location: ${item.locationLabel || item.locationName || "-"}`
                : "";
            const detailParts = [warrantyInfo, locationInfo].filter(Boolean);
            const detailHtml =
              detailParts.length > 0
                ? `<div class="muted">${detailParts.join(" | ")}</div>`
                : "";

            return `
              <tr>
                <td>${item.productCode || "-"}</td>
                <td>
                  <div class="desc-main">${displayProduct(
                    item,
                    productLabels
                  )}</div>
                  ${detailHtml}
                </td>
                <td class="num">${item.quantity}</td>
                <td class="num">${formatMoney(item.unitPrice)}</td>
                <td class="num">${formatMoney(totalPrice)}</td>
              </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="5" class="muted empty">No items added</td></tr>`;

  const bankDetailsHtml = COMPANY_INFO.bankLines
    .map((line) => `<div>${line}</div>`)
    .join("");
  const warrantyTermsHtml = COMPANY_INFO.warrantyLines
    .map((line) => `<li>${line}</li>`)
    .join("");

  const remarkHtml =
    invoice.remark && invoice.remark.trim().length > 0
      ? invoice.remark.trim().replace(/\n/g, "<br />")
      : '<span class="muted">None</span>';

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 24px; background: #f7f7f7; }
          .invoice { max-width: 900px; margin: 0 auto; background: #fff; padding: 28px 32px; border: 1px solid #e0e0e0; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
          .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
          .invoice-title { font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
          .meta-grid { display: grid; grid-template-columns: 120px auto; column-gap: 12px; row-gap: 4px; font-size: 12px; }
          .meta-label { font-weight: 700; text-transform: uppercase; }
          .logo { width: 64px; height: 64px; border: 2px solid #888; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: #444; }
          .header-right { display: flex; align-items: center; gap: 12px; }
          .header-right img { display: block; border: 1px solid #ddd; border-radius: 6px; background: #fff; }
          .qr img { width: 112px; height: 112px; object-fit: contain; }
          .logo-img img { width: 72px; height: 72px; object-fit: contain; }
          .parties { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e5e5; }
          .section-title { font-size: 12px; font-weight: 700; letter-spacing: 0.02em; margin-bottom: 4px; }
          .party-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
          .text-sm { font-size: 12px; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border: 1px solid #dcdcdc; padding: 8px 10px; font-size: 12px; }
          th { background: #f1f1f1; text-align: left; }
          .num { text-align: right; white-space: nowrap; }
          .desc-main { font-weight: 600; margin-bottom: 2px; }
          .muted { color: #666; font-size: 11px; }
          .empty { text-align: center; padding: 16px 8px; }
          .totals { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; font-weight: 700; font-size: 14px; }
          .remarks { margin-top: 20px; }
          .remark-box { padding: 12px 12px 8px; border: 1px solid #dcdcdc; background: #fafafa; font-size: 12px; }
          .bank { margin-top: 12px; line-height: 1.4; }
          .terms { margin-top: 12px; }
          .terms ul { margin: 6px 0 0 16px; padding: 0; }
          .footer-date { margin-top: 24px; text-align: center; font-size: 12px; }
          @media print { body { background: #fff; } .invoice { box-shadow: none; border: none; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="meta-grid">
                <div class="meta-label">NUMBER :</div><div>${
                  invoice.number
                }</div>
                <div class="meta-label">DATE :</div><div>${saleDateLabel}</div>
                <div class="meta-label">SALES REP :</div><div>${salesRep}</div>
                <div class="meta-label">PAYMENT :</div><div>${paymentType}</div>
                <div class="meta-label">PAGE :</div><div>1/1</div>
              </div>
            </div>
            <div class="header-right">
              <div class="qr">
                <img src="${qrSrc}" alt="QR code" />
              </div>
              <div class="logo-img">
                <img src="${logoSrc}" alt="Company logo" />
              </div>
            </div>
          </div>
          <div class="parties">
            <div>
              <div class="section-title">FROM</div>
              <div class="party-name">${COMPANY_INFO.name}</div>
              <div class="text-sm">${COMPANY_INFO.addressLines.join(
                "<br />"
              )}</div>
              <div class="text-sm">Tel: ${COMPANY_INFO.phone}</div>
            </div>
            <div>
              <div class="section-title">TO</div>
              <div class="party-name">${customerText}</div>
              <div class="text-sm">${customerAddress || "-"}</div>
              ${
                customerPhone
                  ? `<div class="text-sm">Tel: ${customerPhone}</div>`
                  : ""
              }
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 120px;">Itemcode</th>
                <th>Description</th>
                <th style="width: 90px; text-align:right;">Quantity</th>
                <th style="width: 110px; text-align:right;">Unit Price</th>
                <th style="width: 110px; text-align:right;">Total Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="totals">
            <div>Grand Total :</div>
            <div>${formatMoney(invoice.grandTotal)}</div>
          </div>
          <div class="remarks">
            <div class="section-title">Remark :</div>
            <div class="remark-box">
              ${remarkHtml}
              <div class="bank">${bankDetailsHtml}</div>
              <div class="terms">
                <div class="section-title">One Week Warranty</div>
                <ul>${warrantyTermsHtml}</ul>
                <div class="muted" style="margin-top:8px;">
                  All warranty claims must be accompanied by the shop's official tax invoice/receipt/proof of purchase.
                  Goods sold are non-refundable or exchangeable. This is a computer-generated receipt. No signature needed.
                </div>
              </div>
            </div>
          </div>
          <div class="footer-date">${longSaleDate}</div>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
    </html>
  `;

  return html;
};
