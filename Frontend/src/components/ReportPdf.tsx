import {
  Document,
  Font,
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

const styles = StyleSheet.create({
  page: { padding: 12, fontSize: 9, fontFamily: "OpenSans" },
  header: { marginBottom: 8 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
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
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 3,
  },

  footer: { marginTop: 12 },
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
      {/* Title */}
      <Text style={styles.title}>Shipping Order</Text>

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Slip No.:</Text>
          <Text style={styles.infoValue}>{data.slipNo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Purchase Order Number:</Text>
          <Text style={styles.infoLabel}>
            {data.type === "stockIn"
              ? "Purchase Order Number:"
              : "Delivery Order Number:"}
          </Text>
          <Text style={styles.infoValue}>{data.orderNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>From:</Text>
          <Text style={styles.infoValue}>
            {data.type === "stockIn" ? data.location : data.warehouse}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery To:</Text>
          <Text style={styles.infoValue}>
            {data.type === "stockIn" ? data.warehouse : data.location}
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
            "Item Name[Spec.]",
            "StockGroup",
            "Color",
            "Size",
            "Category",
            "Available Qty",
            "Order Qty",
            "Location",
            "Warehouse",
          ].map((h, i) => (
            <Text
              key={i}
              style={[styles.headerCell, { flex: i === 0 ? 0.5 : 1 }]}
            >
              {h}
            </Text>
          ))}
        </View>

        {/* Table Rows */}
        {data.items.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={[styles.cell, { flex: 0.5 }]}>{item.no}</Text>
            <Text style={styles.cell}>{item.itemCode}</Text>
            <Text style={styles.cell}>{item.itemName}</Text>
            <Text style={styles.cell}>{item.stockGroup}</Text>
            <Text style={styles.cell}>{item.color}</Text>
            <Text style={styles.cell}>{item.size}</Text>
            <Text style={styles.cell}>{item.category}</Text>
            <Text style={styles.cell}>{item.availableQty}</Text>
            <Text style={styles.cell}>{item.orderQty}</Text>
            <Text style={styles.cell}>{item.location}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>{data.createdAt}</Text>
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
