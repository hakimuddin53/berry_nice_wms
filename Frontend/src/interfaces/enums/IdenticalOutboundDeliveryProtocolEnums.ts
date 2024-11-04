export enum IdenticalOutboundDeliveriesProtocolStatusEnum {
  INITIAL = "INITIAL",
  FINISHED = "FINISHED",
  FINISHED_WITH_ERRORS = "FINISHED_WITH_ERRORS",
}

export enum IdenticalOutboundDeliveriesProtocolLineResultStatusEnum {
  INITIAL = "INITIAL",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export enum IdenticalOutboundDeliveryFilterRequestResultViewEnum {
  UNSPECIFIED = "UNSPECIFIED",
  PLANNED_GOODS_ISSUE_DATE = "PLANNED_GOODS_ISSUE_DATE",
  CREATED_AT = "CREATED_AT",
}

export enum SetPutAwayBanEnum {
  NO = "NO",
  BEFORE_PROCESSING = "BEFORE_PROCESSING",
}

export enum ReleasePutAwayBanEnum {
  NO = "NO",
  WHEN_PROCESSING_EXECUTED_SUCCESSFULLY = "WHEN_PROCESSING_EXECUTED_SUCCESSFULLY",
}
