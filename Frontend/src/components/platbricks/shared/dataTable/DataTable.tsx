import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { TablePropList } from "hooks/useDatatableControls";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "styled-components";
import {
  PbCard,
  PbCardActions,
  PbCardBody,
  PbCardHeader,
  PbCardTitle,
} from "../PbCard";
import { DataTableColumnSettingsModal } from "./DataTableColumnSettingsModal";

const TableActionCell = styled(TableCell)`
  position: sticky;
  right: 0;
  white-space: nowrap;
  background-color: white;
`;
const CustomTableRow = styled(TableRow)`
  border-left: 5px solid transparent;
  &.Mui-error {
    background-color: rgba(255, 10, 10, 0.08);
  }
  &.Mui-error.MuiTableRow-hover:hover {
    background-color: rgba(55, 10, 10, 0.08);
  }
  &.Mui-error.Mui-selected {
    background-color: rgba(255, 10, 10, 0.12);
  }
  &.Mui-selected {
    border-left: 5px solid #7faceb;
  }
  &.Mui-error.Mui-selected.MuiTableRow-hover:hover {
    background-color: rgba(155, 10, 10, 0.12);
  }
  &.Mui-selected ${TableActionCell} {
    background-color: #ebf3f8;
  }
  &:hover ${TableActionCell} {
    background-color: rgb(245 245 245);
  }
  &.Mui-selected:hover ${TableActionCell} {
    background-color: rgb(224, 237, 245);
  }
`;

export type DataTableHeaderCell<T> = {
  id: string;
  label: string;
  hidden?: boolean;
  sortable?: boolean;
  tooltip?: string;
  render?: (row: T) => JSX.Element | string;
};

export type SortableDataTableHeaderCell<T, T2> = DataTableHeaderCell<T> & {
  sortField?: keyof T2;
};

export type DataTableRowAction<T> = {
  render: (row: T) => JSX.Element | string;
};

type DataTableProps<T> = {
  title?: string;
  headerCells: DataTableHeaderCell<T>[];
  data: TablePropList<T>;
  tableKey: string;
  onDelete?: (selections: number[]) => void;
  onAdd?: () => void;
  rowActions?: DataTableRowAction<T>[];
  dataKey: string;
  showSearch?: boolean;
  paddingEnabled?: boolean;
  enableMultiselect?: boolean;
};

const DataTable: React.FC<DataTableProps<any>> = (props) => {
  const { t } = useTranslation();
  const [headerCells, setHeaderCells] = useState<DataTableHeaderCell<any>[]>(
    []
  );
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const setting = getSetting(props.tableKey);
    if (props.tableKey.length > 0) {
      saveSetting(props.tableKey, setting);
    }
    setHeaderCells(setting);
  }, [props.headerCells]);
  /* eslint-enable */

  const updateSetting = (newHeaderCells: DataTableHeaderCell<any>[]) => {
    if (props.tableKey.length > 0) {
      saveSetting(props.tableKey, newHeaderCells);
    }
    setHeaderCells(newHeaderCells);
  };

  const saveSetting = (
    tableKey: string,
    headerCells: DataTableHeaderCell<any>[]
  ) => {
    if (props.tableKey.length > 0) {
      window.localStorage.setItem(tableKey, JSON.stringify(headerCells));
    }
  };

  const getSetting = (tableKey: string) => {
    const newHeaderCells: DataTableHeaderCell<any>[] = [];
    const savedSettingFortableKey = window.localStorage.getItem(tableKey);

    try {
      if (tableKey.length <= 0) {
        throw new Error(t("common:no-data-key"));
      }
      if (savedSettingFortableKey) {
        var savedSettingObject = JSON.parse(
          savedSettingFortableKey
        ) as DataTableHeaderCell<any>[];

        props.headerCells.forEach((cell) => {
          var existedEntry = savedSettingObject.filter((x) => x.id === cell.id);
          if (existedEntry && existedEntry.length === 1) {
            cell.hidden = existedEntry[0].hidden;
          }
          newHeaderCells.push({ ...cell });
        });
      } else {
        throw new Error(
          t("common:saved-setting-for-table-key-not-existed", {
            tableKey: tableKey,
          })
        );
      }
    } catch (e) {
      console.log(e);
      props.headerCells.forEach((cell) => {
        newHeaderCells.push({ ...cell });
      });
    }
    return newHeaderCells;
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    row: any,
    isCheckboxClick: boolean
  ) => {
    if (props.enableMultiselect) {
      if (isCheckboxClick) {
        props.data.rowClickHandler(row[props.dataKey]);
      }
    } else {
      props.data.rowClickHandler(row[props.dataKey]);
    }
  };

  const isSelected = (row: any) => {
    return props.data.selections.includes(row[props.dataKey]);
  };
  const isInvalid = (row: any) => {
    return props.data.invalidRows.includes(row[props.dataKey]);
  };

  var orderBy = props.data.orderBy;
  var order = props.data.order;

  const rows = props.data.pageData;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    rows !== null && props.data.page > 0
      ? props.data.pageSize - rows.length
      : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    props.data.setPage(newPage, undefined);
    props.data.rowClickHandler(undefined);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = parseInt(event.target.value, 10);
    props.data.setPage(0, rpp);
    props.data.rowClickHandler(undefined);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.data.rowClickHandler(undefined);
    if (event.target.checked) {
      props.data.pageData.forEach((x) => {
        props.data.rowClickHandler(x[props.dataKey]);
      });
      return;
    }
  };

  return (
    <>
      <DataTableColumnSettingsModal
        open={settingsModalOpen}
        handleClose={() => setSettingsModalOpen(false)}
        headerCells={headerCells}
        setHeaderCells={updateSetting}
      />
      <PbCard paddingEnabled={props.paddingEnabled}>
        <PbCardHeader>
          <PbCardTitle>{props.title}</PbCardTitle>
          <PbCardActions>
            {props.showSearch && (
              <TextField
                type="text"
                name="searchValue"
                label={t("common:search")}
                size="small"
                style={{ marginRight: "1em" }}
                onChange={(event) =>
                  props.data.setSearchValue(event.target.value)
                }
              />
            )}
            <Tooltip title={t("common:table-settings")}>
              <IconButton onClick={() => setSettingsModalOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {(props.onDelete || props.onAdd) && " | "}
            {props.onDelete && (
              <Tooltip title={t("common:delete")}>
                <span>
                  <IconButton
                    onClick={() => props.onDelete!(props.data.selections)}
                    color="error"
                    disabled={props.data.selections.length === 0}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {props.onAdd && (
              <Tooltip title={t("common:add-new")}>
                <IconButton onClick={() => props.onAdd!()}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </PbCardActions>
        </PbCardHeader>
        <PbCardBody>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  {props.enableMultiselect && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          props.data.selections.length > 0 &&
                          props.data.selections.length <
                            props.data.pageData.length
                        }
                        checked={
                          props.data.pageData.length > 0 &&
                          props.data.selections.length ===
                            props.data.pageData.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{ "aria-label": "select all" }}
                      />
                    </TableCell>
                  )}
                  {headerCells.map((headerCell) => {
                    if (headerCell.hidden) return <></>;
                    return (
                      <TableCell
                        key={headerCell.id}
                        sortDirection={
                          orderBy === headerCell.id ? order : false
                        }
                        style={{ fontWeight: "bolder" }}
                      >
                        {!headerCell.sortable ? (
                          !headerCell.tooltip ? (
                            headerCell.label
                          ) : (
                            <Tooltip
                              title={headerCell.tooltip}
                              placement="bottom-start"
                            >
                              <span>{headerCell.label}</span>
                            </Tooltip>
                          )
                        ) : (
                          <TableSortLabel
                            active={orderBy === headerCell.id}
                            direction={
                              orderBy === headerCell.id ? order : "asc"
                            }
                            onClick={() => {
                              var orderByChanged = headerCell.id !== orderBy;
                              props.data.setOrder(
                                orderByChanged
                                  ? "asc"
                                  : order === "asc"
                                  ? "desc"
                                  : "asc",
                                headerCell.id
                              );
                            }}
                          >
                            {!headerCell.tooltip ? (
                              headerCell.label
                            ) : (
                              <Tooltip
                                title={headerCell.tooltip}
                                placement="bottom-start"
                              >
                                <span>{headerCell.label}</span>
                              </Tooltip>
                            )}
                            {orderBy === headerCell.id ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc"
                                  ? "sorted descending"
                                  : "sorted ascending"}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    );
                  })}
                  {props.rowActions && props.rowActions.length > 0 && (
                    <TableActionCell key="rowActions"></TableActionCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
            rows.slice().sort(getComparator(order, orderBy)) */}
                {rows !== null &&
                  rows.map((row: any, index: any) => {
                    const isItemSelected = isSelected(row);
                    const isItemInvalid = isInvalid(row);

                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <CustomTableRow
                        hover
                        role="checkbox"
                        onClick={(event: any) => handleClick(event, row, false)}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row[props.dataKey]}
                        selected={isItemSelected}
                        className={isItemInvalid ? "Mui-error" : ""}
                      >
                        {props.enableMultiselect && (
                          <TableCell padding="checkbox" key="selectCell">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                              onClick={(event) => handleClick(event, row, true)}
                            />
                          </TableCell>
                        )}
                        {headerCells.map((headerCell) => {
                          if (headerCell.hidden) return <></>;
                          return (
                            <TableCell key={headerCell.id}>
                              {headerCell.render
                                ? headerCell.render(row)
                                : row[headerCell.id]}
                            </TableCell>
                          );
                        })}
                        {props.rowActions && props.rowActions.length > 0 && (
                          <TableActionCell
                            key="rowActions"
                            padding="none"
                            align="right"
                          >
                            {props.rowActions.map((rowAction) =>
                              rowAction.render(row)
                            )}
                          </TableActionCell>
                        )}
                      </CustomTableRow>
                    );
                  })}
                {!props.data.loading && rows !== null && emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell
                      colSpan={
                        headerCells.filter((x) => !x.hidden).length +
                        (props.rowActions && props.rowActions.length > 0
                          ? 1
                          : 0)
                      }
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {(props.data.loading || rows === null) && (
              <p style={{ textAlign: "center" }}>
                <i>{t("common:loading")}...</i>
              </p>
            )}
            {!props.data.loading && rows !== null && rows.length === 0 && (
              <p style={{ textAlign: "center" }}>
                <i>{t("no-entries-found")}</i>
              </p>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 100]}
            component="div"
            count={Math.max(
              props.data.totalCount ?? 0,
              props.data.data.length ?? 0
            )}
            rowsPerPage={props.data.pageSize ?? 10}
            page={props.data.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t("common:rows-per-page")}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}–${to} ${t("common:of")} ${
                count !== -1 ? count : `${t("common:more-than")} ${to}`
              }`;
            }}
          />
        </PbCardBody>
      </PbCard>
    </>
  );
};

export default React.memo(DataTable);
