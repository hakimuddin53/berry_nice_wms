import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockReservationDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  warehouseId: guid;
  reservedAt: string;
  expiresAt: string;
  status: ReservationStatusEnum;
  cancellationRemark: string | null;
  cancellationRequestedBy: string | null;
  cancellationRequestedAt: string | null;
  cancellationApprovedBy: string | null;
  cancellationApprovedAt: string | null;
  stockReservationItems: StockReservationItemDetailsDto[];
}

export interface StockReservationItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockReservationId: guid;
  productId: guid;
  quantity: number;
}

export interface ActiveReservationItemDto {
  reservationId: guid;
  number: string;
  reservedAt: string;
  expiresAt: string;
  reservationItemId: guid;
  quantity: number;
}
