import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { KeyedObject } from "interfaces/v12/dashboard/ChartResultV12Dto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TableChartProps {
  data: KeyedObject[];
}
const TableChart = (props: TableChartProps) => {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState<KeyedObject[]>(
    JSON.parse(JSON.stringify(props.data))
  );
  const [orderBy, setOrderBy] = useState<string>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(props.data)));
  }, [props.data]);

  const sortBy = (key: string) => {
    var newOrder: "asc" | "desc" = order === "asc" ? "desc" : "asc";
    if (orderBy !== key) {
      newOrder = "asc";
    }
    setOrderBy(key);
    setOrder(newOrder);
    setData((d) =>
      d.sort((a, b) =>
        (a[key] ?? "") > (b[key] ?? "")
          ? newOrder === "asc"
            ? 1
            : -1
          : newOrder === "asc"
          ? -1
          : 1
      )
    );
  };

  if (!props.data || props.data.length === 0) {
    return <>{t("no-data-to-display")}</>;
  }

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell
                key={key}
                sortDirection={orderBy === key ? order : false}
              >
                <TableSortLabel
                  active={orderBy === key}
                  direction={orderBy === key ? order : "asc"}
                  onClick={() => sortBy(key)}
                >
                  {key}
                  {orderBy === key ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.keys(data[0]).map((key) => (
                <TableCell key={key}>
                  {typeof row[key] === "number"
                    ? Math.round((row[key] as number) * 10000) / 10000
                    : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableChart;
