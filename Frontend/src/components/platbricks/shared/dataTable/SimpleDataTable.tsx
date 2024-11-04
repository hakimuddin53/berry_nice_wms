import { useDatatableControls } from "hooks/useDatatableControls";
import React, { useEffect } from "react";
import DataTable, { DataTableRowAction } from "./DataTable";

export type DataTableHeaderCell<T> = {
  id: string;
  label: string;
  hidden?: boolean;
  render?: (row: T) => JSX.Element | string;
};

type SimpleDataTableProps<T> = {
  title: string;
  tableKey: string;
  headerCells: DataTableHeaderCell<T>[];
  data: T[];
  dataKey: string;
  onSelectionChanged?: (rows: T[]) => void;
  selectionMode?: "single" | "multiple" | "none";
  rowActions?: DataTableRowAction<T>[];
};

const SimpleDataTable: React.FC<SimpleDataTableProps<any>> = (props) => {
  const { tableProps } = useDatatableControls({
    initialData: props.data.map((a: any, b: number) => ({
      ...a,
      key: b,
    })),
    selectionMode:
      props.selectionMode || (props.onSelectionChanged ? "single" : "none"),
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (props.onSelectionChanged) {
      props.onSelectionChanged(
        props.data.filter((d) =>
          tableProps.selections.find((x) => x === d[props.dataKey])
        )
      );
    }
  }, [tableProps.selections]);
  /* eslint-enable */

  return (
    <DataTable
      title={props.title}
      tableKey={props.tableKey}
      headerCells={props.headerCells}
      data={tableProps}
      dataKey={props.dataKey}
      rowActions={props.rowActions}
    />
  );
};

export default SimpleDataTable;
