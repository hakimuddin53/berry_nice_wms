import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useUserDateTime } from "hooks/useUserDateTime";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  LogbookAvailabilityDto,
  LogbookCreateDto,
  LogbookSearchDto,
  LogbookStatusHistoryDto,
  LogbookUpdateDto,
} from "interfaces/v12/logbook/logbookDto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogbookService } from "services/LogbookService";

const statusOptions = [
  { value: "OUT", label: "Out" },
  { value: "RETURNED", label: "Returned" },
];

const LogbookPage: React.FC = () => {
  const { t } = useTranslation();
  const logbookService = useLogbookService();
  const { getLocalDateAndTime } = useUserDateTime();

  const [filters, setFilters] = useState<{
    search: string;
    status: string;
  }>({ search: "", status: "" });

  const [historyDialog, setHistoryDialog] = useState<{
    open: boolean;
    loading: boolean;
    entry: LogbookAvailabilityDto | null;
    history: LogbookStatusHistoryDto[];
    status: string;
    remark: string;
  }>({
    open: false,
    loading: false,
    entry: null,
    history: [],
    status: "OUT",
    remark: "",
  });

  const headerCells: DataTableHeaderCell<LogbookAvailabilityDto>[] = useMemo(
    () => [
      {
        id: "productCode",
        label: t("product-code", { defaultValue: "Product code" }),
        render: (row) => row.productCode,
      },
      {
        id: "userName",
        label: t("user", { defaultValue: "User" }),
        render: (row) => row.userName ?? "",
      },
      {
        id: "remark",
        label: t("remark", { defaultValue: "Remark" }),
        render: (row) => row.remark ?? "",
      },
      {
        id: "statusChangedAt",
        label: t("status-updated-at", { defaultValue: "Status updated" }),
        render: (row) =>
          row.statusChangedAt ? getLocalDateAndTime(row.statusChangedAt) : "",
      },
      {
        id: "status",
        label: t("status", { defaultValue: "Status" }),
        render: (row) =>
          row.status ? (
            <Chip
              label={row.status}
              color={row.status === "RETURNED" ? "success" : "warning"}
              size="small"
            />
          ) : (
            ""
          ),
      },
    ],
    [t]
  );

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string
  ): LogbookSearchDto => ({
    search: searchValue || filters.search || undefined,
    status: filters.status ? filters.status.toUpperCase() : undefined,
    page: page + 1,
    pageSize,
  });

  const loadData = useCallback(
    (
      page: number,
      pageSize: number,
      searchValue: string,
      _orderBy: string,
      _order: "asc" | "desc"
    ): Promise<LogbookAvailabilityDto[]> => {
      const searchOptions = getSearchOptions(page, pageSize, searchValue);
      return logbookService
        .searchAvailable(searchOptions)
        .then((res: PagedListDto<LogbookAvailabilityDto>) => res.data)
        .catch(() => []);
    },
    [filters.search, filters.status, logbookService]
  );

  const loadDataCount = useCallback(
    (
      page: number,
      pageSize: number,
      searchValue: string,
      _orderBy: string,
      _order: "asc" | "desc"
    ) => {
      const searchOptions = getSearchOptions(page, pageSize, searchValue);
      return logbookService.countAvailable(searchOptions).catch(() => 0);
    },
    [filters.search, filters.status, logbookService]
  );

  const { tableProps, reloadData } =
    useDatatableControls<LogbookAvailabilityDto>({
      initialData: [],
      loadData,
      loadDataCount,
    });

  useEffect(() => {
    reloadData();
  }, [reloadData, filters]);

  const openHistoryDialog = async (row: LogbookAvailabilityDto) => {
    setHistoryDialog({
      open: true,
      loading: !!row.logbookEntryId,
      entry: row,
      history: [],
      status: row.status ?? "OUT",
      remark: row.remark ?? "",
    });
    if (row.logbookEntryId) {
      try {
        const history = await logbookService.getHistory(row.logbookEntryId);
        setHistoryDialog((prev) => ({
          ...prev,
          loading: false,
          history,
        }));
      } catch {
        setHistoryDialog((prev) => ({ ...prev, loading: false }));
      }
    }
  };

  const closeHistoryDialog = () =>
    setHistoryDialog((prev) => ({ ...prev, open: false }));

  const handleHistorySave = async () => {
    const entry = historyDialog.entry;
    try {
      setHistoryDialog((prev) => ({ ...prev, loading: true }));
      if (entry?.logbookEntryId) {
        const dto: LogbookUpdateDto = {
          status: historyDialog.status,
          purpose: historyDialog.remark,
        };
        await logbookService.update(entry.logbookEntryId, dto);
        const refreshedHistory = await logbookService.getHistory(
          entry.logbookEntryId
        );
        setHistoryDialog((prev) => ({
          ...prev,
          loading: false,
          history: refreshedHistory,
          entry: {
            ...entry,
            status: dto.status ?? entry.status,
            remark: dto.purpose ?? entry.remark,
            statusChangedAt: new Date().toISOString(),
          },
        }));
      } else if (entry?.productCode) {
        const createDto: LogbookCreateDto = {
          barcode: entry.productCode,
          productId: entry.productId,
          purpose: historyDialog.remark,
          status: historyDialog.status,
          dateUtc: new Date().toISOString(),
        };
        const created = await logbookService.create(createDto);
        const refreshedHistory = await logbookService.getHistory(created.id);
        setHistoryDialog((prev) => ({
          ...prev,
          loading: false,
          history: refreshedHistory,
          entry: {
            ...entry,
            logbookEntryId: created.id,
            status: created.status ?? historyDialog.status,
            remark: historyDialog.remark,
            statusChangedAt:
              created.statusChangedAt ?? new Date().toISOString(),
            userName: created.userName ?? entry.userName,
          },
        }));
      } else {
        setHistoryDialog((prev) => ({ ...prev, loading: false }));
      }
      reloadData(false);
    } catch {
      setHistoryDialog((prev) => ({ ...prev, loading: false }));
    }

    setHistoryDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <Page
      title={t("logbook", { defaultValue: "Logbook" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("logbook", { defaultValue: "Logbook" }) },
      ]}
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("search", { defaultValue: "Search" })}
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label={t("keyword", { defaultValue: "Keyword" })}
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  placeholder={t("common:search", { defaultValue: "Search" })}
                />
                <TextField
                  select
                  fullWidth
                  label={t("status", { defaultValue: "Status" })}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <MenuItem value="">
                    {t("all", { defaultValue: "All" })}
                  </MenuItem>
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFilters({
                      search: "",
                      status: "",
                    })
                  }
                >
                  {t("common:reset", { defaultValue: "Reset" })}
                </Button>
                <Button variant="contained" onClick={() => reloadData()}>
                  {t("common:search", { defaultValue: "Search" })}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <DataTable
              title={t("logbook", { defaultValue: "Logbook" })}
              tableKey="LogbookPage"
              headerCells={headerCells}
              data={tableProps}
              dataKey="productId"
              rowActions={[
                {
                  render: (row) => (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        openHistoryDialog(row);
                      }}
                    >
                      {t("update", { defaultValue: "Update" })}
                    </Button>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>
      </Stack>
      <Dialog
        open={historyDialog.open}
        onClose={closeHistoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t("history", { defaultValue: "History" })}{" "}
          {historyDialog.entry?.productCode
            ? `- ${historyDialog.entry.productCode}`
            : ""}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label={t("status", { defaultValue: "Status" })}
              value={historyDialog.status}
              onChange={(e) =>
                setHistoryDialog((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label={t("remark", { defaultValue: "Remark" })}
              value={historyDialog.remark}
              onChange={(e) =>
                setHistoryDialog((prev) => ({
                  ...prev,
                  remark: e.target.value,
                }))
              }
              multiline
              minRows={2}
            />
            <Divider />
            <Typography variant="subtitle2">
              {t("status-history", { defaultValue: "Status history" })}
            </Typography>
            {historyDialog.loading ? (
              <Typography variant="body2" color="text.secondary">
                {t("common:loading", { defaultValue: "Loading..." })}
              </Typography>
            ) : historyDialog.history.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t("no-history", { defaultValue: "No history yet." })}
              </Typography>
            ) : (
              <List dense>
                {historyDialog.history.map((item) => (
                  <ListItem key={item.id} divider disableGutters>
                    <ListItemText
                      primary={`${getLocalDateAndTime(item.changedAt)} - ${
                        item.status
                      }`}
                      secondary={
                        item.remark
                          ? `${item.userName} - ${item.remark}`
                          : item.userName
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHistoryDialog}>
            {t("common:cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            variant="contained"
            onClick={handleHistorySave}
            disabled={!historyDialog.entry}
          >
            {t("common:save", { defaultValue: "Save" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default LogbookPage;
