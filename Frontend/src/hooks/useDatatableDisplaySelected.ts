import { useEffect, useState } from "react";

export const useDatatableDisplaySelected = (props: {
  pageData: any;
  selections: number[];
}) => {
  const [selectedRowData, setSelectedRowData] = useState<any | undefined>(
    undefined
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    let resData = props.pageData.find(
      (d: any) => d.id === (props.selections[0] as any)
    );
    if (resData === selectedRowData) {
      setSelectedRowData(undefined);
    } else if (resData !== undefined) {
      setSelectedRowData({ ...resData });
    }
  }, [props.selections, props.pageData]);
  /* eslint-enable */

  return props.selections.length > 0 && selectedRowData !== undefined
    ? selectedRowData
    : undefined;
};
