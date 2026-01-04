import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Page from "components/platbricks/shared/Page";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { StockTakeDetailsDto } from "interfaces/v12/stockTake/stockTakeDetailsDto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useStockTakeService } from "services/StockTakeService";

const StockTakeDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const stockTakeService = useStockTakeService();

  const [data, setData] = useState<StockTakeDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await stockTakeService.getById(id);
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, stockTakeService]);

  const items = data?.items ?? [];

  const inventoryItems = items.filter((item) => item.productId);
  const missingItems = items.filter((item) => !item.productId);

  return (
    <Page
      title={t("stock-take", { defaultValue: "Stock Take" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        {
          label: t("stock-take", { defaultValue: "Stock Take" }),
          to: "/stock-take",
        },
        {
          label:
            data?.number || t("common:details", { defaultValue: "Details" }),
        },
      ]}
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("details", { defaultValue: "Details" })}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  {t("warehouse", { defaultValue: "Warehouse" })}
                </Typography>
                <Typography variant="body1">
                  {data?.warehouseName || data?.warehouseId || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  {t("remark", { defaultValue: "Remark" })}
                </Typography>
                <Typography variant="body1">{data?.remark || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  {t("common:created-at", { defaultValue: "Created" })}
                </Typography>
                <Typography variant="body1">
                  {data?.takenAt ? <UserDateTime date={data.takenAt} /> : "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                {t("common:loading", { defaultValue: "Loading..." })}
              </Typography>
            ) : (
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems="stretch"
              >
                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t("items", { defaultValue: "Items" })}
                  </Typography>
                  {inventoryItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {t("start-scanning-to-see-inventory", {
                        defaultValue: "Start scanning to add items.",
                      })}
                    </Typography>
                  ) : (
                    <List dense>
                      {inventoryItems.map((item) => (
                        <ListItem
                          key={
                            item.id ??
                            `${item.productId}-${item.scannedBarcode}`
                          }
                          divider
                        >
                          <ListItemText
                            primary={
                              item.productCode ||
                              item.scannedBarcode ||
                              item.productId ||
                              "-"
                            }
                            secondary={item.remark || ""}
                          />
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={`${t("counted-quantity", {
                                defaultValue: "Counted",
                              })}: ${item.countedQuantity}`}
                              color="primary"
                              size="small"
                            />
                            <Chip
                              label={`${t("system-quantity", {
                                defaultValue: "System",
                              })}: ${item.systemQuantity}`}
                              variant="outlined"
                              size="small"
                            />
                            <Chip
                              label={`${t("difference", {
                                defaultValue: "Diff",
                              })}: ${item.differenceQuantity}`}
                              variant="outlined"
                              size="small"
                            />
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t("not-in-inventory", {
                      defaultValue: "Not in inventory",
                    })}
                  </Typography>
                  {missingItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {t("no-missing-scans", {
                        defaultValue: "No missing barcodes yet.",
                      })}
                    </Typography>
                  ) : (
                    <List dense>
                      {missingItems.map((item) => (
                        <ListItem
                          key={
                            item.id ??
                            item.scannedBarcode ??
                            `${item.productId}-${item.countedQuantity}`
                          }
                          divider
                        >
                          <ListItemText
                            primary={item.scannedBarcode || "-"}
                            secondary={t("flagged-not-in-inventory", {
                              defaultValue: "Flagged as not in inventory",
                            })}
                          />
                          <Chip
                            label={`${t("scanned", {
                              defaultValue: "Scanned",
                            })}: ${item.countedQuantity}`}
                            color="warning"
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Page>
  );
};

export default StockTakeDetailsPage;
