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
  sku: string;
  description: string;
  quantity: number;
}

export interface Print {
  number: string;
  poNumber: string;
  warehouse: string;
  createdAt: string;
  createdBy: string;
  changedAt: string;
  changedBy: string;
  items: PrintItem[];
}

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: "OpenSans", fontSize: 10 },
  header: { marginBottom: 12 },
  title: { fontSize: 16, marginBottom: 4 },
  section: { marginBottom: 6 },
  label: { fontWeight: "bold" },
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: { flexDirection: "row" },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    flex: 1,
  },
  headerCell: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
});

export const ReportPdf: React.FC<{ data: Print }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stock-In {data.number}</Text>
        <Text>PO#: {data.poNumber}</Text>
      </View>

      {/* Metadata */}
      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Warehouse: </Text>
          {data.warehouse}
        </Text>
        <Text>
          <Text style={styles.label}>Created: </Text>
          {new Date(data.createdAt).toLocaleString()}
        </Text>
        <Text>
          <Text style={styles.label}>By: </Text>
          {data.createdBy}
        </Text>
        <Text>
          <Text style={styles.label}>Changed: </Text>
          {new Date(data.changedAt).toLocaleString()}
        </Text>
        <Text>
          <Text style={styles.label}>By: </Text>
          {data.changedBy}
        </Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.headerCell]}>
          <Text style={styles.tableCell}>SKU</Text>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Qty</Text>
        </View>
        {/* Data Rows */}
        {data.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.sku}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
