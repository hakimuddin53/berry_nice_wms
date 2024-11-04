export const SignalRNotificationEnum = {
  NotifyBegin: "NotifyBegin",
  Notify: "Notify",
  NotifyEnd: "NotifyEnd",
  NotifyExport: "NotifyExport",
  Result: "Result",
  HubResult: "HubResult",
  ExportResult: "ExportResult",
  TaskExecuting: "TaskExecuting",
  HubResultWithoutDownload: "HubResultWithoutDownload",
  RefreshEventNotification: "RefreshEventNotification",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type SignalRNotificationEnum =
  typeof SignalRNotificationEnum[keyof typeof SignalRNotificationEnum];
/* eslint-enable */
