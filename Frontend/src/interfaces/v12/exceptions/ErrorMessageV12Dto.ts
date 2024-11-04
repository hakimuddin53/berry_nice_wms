export interface ErrorMessageV12Dto {
  errorCode: string;
  errorMessage: string;
  arguments: ErrorMessageArgumentV12[];
}

export interface ErrorMessageArgumentV12 {
  key: string;
  value: string;
}
