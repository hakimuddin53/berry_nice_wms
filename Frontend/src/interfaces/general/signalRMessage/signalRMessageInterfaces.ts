export interface SignalRNotification {
  TaskId: string;
  Percentage: number;
  TaskName: string;
  Color:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
}

export interface SignalRNotify {
  TaskId: string;
  Percentage: string;
  TaskName: string;
}

export interface SignalRHubProgressResult {
  taskId: string;
  modalTitleKey: string;
  modalTitleArgs: string[];
  modalTitle: string;
  successCount: number;
  failedCount: number;
  updatedCount: number;
  messages: string[] | SignalRHubResultMessage[];
}

export interface SignalRPopupDetail {
  title: string;
  titleKey: string;
  titleArgs: string[];
  type: "default" | "success" | "warning" | "error";
  message: string;
  subMessages: string[] | SignalRHubResultMessage[];
}

export interface SignalRHubResultMessage {
  key: string;
  args: string[];
}
