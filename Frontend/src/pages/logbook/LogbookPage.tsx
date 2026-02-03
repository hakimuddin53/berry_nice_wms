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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import Page from "components/platbricks/shared/Page";
import SelectAsync, {
  type SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync";
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
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogbookService } from "services/LogbookService";
import { useUserService } from "services/UserService";

type StatusOption = { value: string; label: string };

const toStatusOption = (
  value?: string | null,
  label?: string | null
): StatusOption | null => (value ? { value, label: label ?? value } : null);

const getStatusLabel = (option: StatusOption | null, fallback = "") =>
  option?.label?.trim() || option?.value?.trim() || fallback;

const LogbookPage: React.FC = () => {
  const { t } = useTranslation();
  const logbookService = useLogbookService();
  const userService = useUserService();
  const { getLocalDateAndTime } = useUserDateTime();

  const [filters, setFilters] = useState<{
    search: string;
    status: StatusOption | null;
  }>({ search: "", status: null });
  const filtersRef = useRef(filters);

  const [historyDialog, setHistoryDialog] = useState<{
    open: boolean;
    loading: boolean;
    entry: LogbookAvailabilityDto | null;
    history: LogbookStatusHistoryDto[];
    status: StatusOption | null;
    remark: string;
    user: SelectAsyncOption | null;
    userError?: boolean;
  }>({
    open: false,
    loading: false,
    entry: null,
    history: [],
    status: null,
    remark: "",
    user: null,
    userError: false,
  });

  const headerCells: DataTableHeaderCell<LogbookAvailabilityDto>[] = useMemo(
    () => [
      {
        id: "productCode",
        label: t("product-code", { defaultValue: "Product code" }),
        render: (row) => row.productCode,
      },
      {
        id: "productName",
        label: t("product-name", { defaultValue: "Product Name" }),
        render: (row) => row.productName || "",
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
          row.logbookStatusId || row.statusLabel ? (
            <Chip
              label={row.statusLabel ?? row.logbookStatusId ?? ""}
              color={
                (row.statusLabel ?? row.logbookStatusId ?? "").toUpperCase() ===
                "RETURNED"
                  ? "success"
                  : "warning"
              }
              size="small"
            />
          ) : (
            ""
          ),
      },
    ],
    [getLocalDateAndTime, t]
  );

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const getSearchOptions = useCallback(
    (page: number, pageSize: number, searchValue: string): LogbookSearchDto => {
      const current = filtersRef.current;
      return {
        search: searchValue || current.search || undefined,
        logbookStatusId: current.status?.value ?? undefined,
        page: page + 1,
        pageSize,
      };
    },
    []
  );

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
    [getSearchOptions, logbookService]
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
    [getSearchOptions, logbookService]
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
      status: toStatusOption(row.logbookStatusId, row.statusLabel),
      remark: row.remark ?? "",
      user: row.userName ? { label: row.userName, value: row.userName } : null,
      userError: false,
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
    const selectedUser = historyDialog.user;
    const statusLabel = getStatusLabel(historyDialog.status, "");
    if (!selectedUser || !selectedUser.label?.trim()) {
      setHistoryDialog((prev) => ({ ...prev, userError: true }));
      return;
    }
    if (!statusLabel || !historyDialog.status?.value) {
      return;
    }
    const trimmedUser = selectedUser.label.trim();

    try {
      setHistoryDialog((prev) => ({ ...prev, loading: true }));
      if (entry?.logbookEntryId) {
        const dto: LogbookUpdateDto = {
          logbookStatusId: historyDialog.status.value,
          purpose: historyDialog.remark,
          userName: trimmedUser,
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
            logbookStatusId: dto.logbookStatusId ?? entry.logbookStatusId,
            remark: dto.purpose ?? entry.remark,
            statusChangedAt: new Date().toISOString(),
            userName: trimmedUser,
          },
          status: toStatusOption(
            dto.logbookStatusId ?? historyDialog.status?.value,
            statusLabel
          ),
        }));
      } else if (entry?.productCode) {
        const createDto: LogbookCreateDto = {
          barcode: entry.productCode,
          productId: entry.productId,
          purpose: historyDialog.remark,
          logbookStatusId: historyDialog.status.value,
          dateUtc: new Date().toISOString(),
          userName: trimmedUser,
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
            logbookStatusId:
              created.logbookStatusId ?? historyDialog.status?.value ?? "",
            remark: historyDialog.remark,
            statusChangedAt:
              created.statusChangedAt ?? new Date().toISOString(),
            userName: created.userName ?? trimmedUser,
          },
          status: toStatusOption(
            created.logbookStatusId ?? historyDialog.status?.value ?? "",
            statusLabel
          ),
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
                <LookupAutocomplete
                  groupKey={LookupGroupKey.LogbookStatus}
                  name="statusFilter"
                  label={t("status", { defaultValue: "Status" })}
                  placeholder={t("all", { defaultValue: "All" })}
                  value={filters.status?.value ?? ""}
                  allowCreate
                  onChange={(value, option) =>
                    setFilters((f) => ({
                      ...f,
                      status:
                        option && option.value
                          ? { value: option.value, label: option.label }
                          : value
                          ? { value, label: value }
                          : null,
                    }))
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFilters({
                      search: "",
                      status: null,
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
            <LookupAutocomplete
              groupKey={LookupGroupKey.LogbookStatus}
              name="status"
              label={t("status", { defaultValue: "Status" })}
              value={historyDialog.status?.value ?? ""}
              placeholder={t("status", { defaultValue: "Status" })}
              allowCreate
              disableClearable
              onChange={(value, option) =>
                setHistoryDialog((prev) => ({
                  ...prev,
                  status:
                    option && option.value
                      ? { value: option.value, label: option.label }
                      : value
                      ? { value, label: value }
                      : null,
                }))
              }
            />
            <SelectAsync
              name="user"
              label={t("user", { defaultValue: "User" })}
              placeholder={t("user", { defaultValue: "User" })}
              asyncFunc={(value, page, pageSize) =>
                userService.getSelectOptions(value, page, pageSize)
              }
              suggestionsIfEmpty
              initValue={historyDialog.user ?? undefined}
              onSelectionChange={(option) =>
                setHistoryDialog((prev) => ({
                  ...prev,
                  user: option,
                  userError: !option,
                }))
              }
              error={historyDialog.userError}
              helperText={
                historyDialog.userError
                  ? t("user-required", { defaultValue: "User is required" })
                  : undefined
              }
            />
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
                        item.statusLabel ?? item.logbookStatusId ?? ""
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
            disabled={
              !historyDialog.entry ||
              !historyDialog.user ||
              !historyDialog.status
            }
          >
            {t("common:save", { defaultValue: "Save" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default LogbookPage;
