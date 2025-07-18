import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Optionally register a font
Font.register({
  family: "OpenSans",
  src: "https://fonts.gstatic.com/s/opensans/v20/mem8YaGs126MiZpBA-U1UpcaXcl0Aw.ttf",
});

export interface PrintItem {
  no: number;
  itemCode: string;
  itemName: string;
  stockGroup: string;
  color: string;
  size: string;
  category: string;
  availableQty: number;
  orderQty: number;
  location: string;
}

export interface Print {
  slipNo: string;
  orderNumber: string;
  location: string;
  warehouse: string;
  createdAt: string;
  createdBy: string;
  type: string;
  items: PrintItem[];
}

const columnFlex = [0.5, 2, 2, 1, 1, 1, 1, 0.8, 0.8, 1]; // Adjust as needed for your data

const styles = StyleSheet.create({
  page: { padding: 12, fontSize: 9, fontFamily: "OpenSans" },
  logo: { width: 100, height: 100, marginBottom: 8, marginLeft: "auto" },
  header: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  dateText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 4,
  },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { width: "20%", fontWeight: "bold" },
  infoValue: { width: "80%" },

  table: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 8,
  },
  tableRow: { flexDirection: "row" },
  headerCell: {
    backgroundColor: "#eee",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 3,
    fontWeight: "bold",
    wrap: true,
    maxWidth: "100%",
    minWidth: 0,
    wordBreak: "break-word",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 3,
    wrap: true, // Enable text wrapping
    maxWidth: "100%", // Prevent overflow
    minWidth: 0, // Allow shrinking for flex
    wordBreak: "break-word", // Ensure long words wrap
  },

  footer: { marginTop: 20 },
  footerRow: { flexDirection: "row", marginBottom: 16 },
  footerLabel: { width: "50%", fontWeight: "bold" },
  footerLine: {
    width: "50%",
    textAlign: "right",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
});

export const ReportPdf: React.FC<{ data: Print }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src={"/static/img/logo/platbricks.png"} style={styles.logo} />
      {/* Title */}
      <Text style={styles.title}>Shipping Order</Text>
      <Text style={styles.dateText}>
        {new Date(data.createdAt + "Z").toLocaleString("en-MY", {
          timeZone: "Asia/Kuala_Lumpur",
          hour12: true,
        })}
      </Text>

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Slip No.:</Text>
          <Text style={styles.infoValue}>{data.slipNo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {data.type === "Stock In"
              ? "Purchase Order Number:"
              : "Delivery Order Number:"}
          </Text>
          <Text style={styles.infoValue}>{data.orderNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>From:</Text>
          <Text style={styles.infoValue}>
            {data.type === "Stock In" ? data.location : data.warehouse}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery To:</Text>
          <Text style={styles.infoValue}>
            {data.type === "Stock In" ? data.warehouse : data.location}
          </Text>
        </View>
      </View>

      {/* Items Table */}

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          {[
            "No.",
            "Item Code",
            "Item Name",
            "StockGroup",
            "Color",
            "Size",
            "Category",
            "Avl Qty",
            "Order Qty",
            "Location",
          ].map((h, i) => (
            <Text key={i} style={[styles.headerCell, { flex: columnFlex[i] }]}>
              {h}
            </Text>
          ))}
        </View>

        {/* Table Rows */}
        {data.items.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={[styles.cell, { flex: columnFlex[0] }]}>
              {item.no}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[1] }]}>
              {item.itemCode}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[2] }]}>
              {item.itemName}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[3] }]}>
              {item.stockGroup}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[4] }]}>
              {item.color}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[5] }]}>
              {item.size}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[6] }]}>
              {item.category}
            </Text>
            <Text
              style={[styles.cell, { flex: columnFlex[7], textAlign: "right" }]}
            >
              {item.availableQty}
            </Text>
            <Text
              style={[styles.cell, { flex: columnFlex[8], textAlign: "right" }]}
            >
              {item.orderQty}
            </Text>
            <Text style={[styles.cell, { flex: columnFlex[9] }]}>
              {item.location}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Picker Name:</Text>
          <Text style={styles.footerLine} />
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Sign:</Text>
          <Text style={styles.footerLine} />
        </View>
      </View>
    </Page>
  </Document>
);
