export interface ProductAuditLogDto {
  id: string;
  productId: string;
  propertyName: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy: string;
  changedAt: string;
}
