export interface CreatedChangedEntity {
  createdAt: string;
  createdById: string;
  changedAt?: string | null;
  changedById?: string | null;
}
