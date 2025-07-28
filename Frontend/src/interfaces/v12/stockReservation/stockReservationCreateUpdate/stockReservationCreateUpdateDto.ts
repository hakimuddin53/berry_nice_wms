import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { guid } from "types/guid";

export interface StockReservationCreateUpdateDto {
  number?: string | null;
  warehouseId: guid;
  reservedAt: string;
  expiresAt: string;
  status: ReservationStatusEnum;
  cancellationRemark?: string | null;
  cancellationRequestedBy?: string | null;
  cancellationRequestedAt?: string | null;
  cancellationApprovedBy?: string | null;
  cancellationApprovedAt?: string | null;
  stockReservationItems: StockReservationItemCreateUpdateDto[] | null;
}

export interface StockReservationItemCreateUpdateDto {
  productId: string;
  quantity: number;
}
