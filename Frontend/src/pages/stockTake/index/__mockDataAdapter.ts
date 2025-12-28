import { StockTakeDetailsDto } from "interfaces/v12/stockTake/stockTakeDetailsDto";

export const flattenStockTake = (item: StockTakeDetailsDto) => ({
  ...item,
  items: item.items?.length ?? 0,
});
