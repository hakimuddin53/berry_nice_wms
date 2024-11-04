export interface HttpResponseMessageV12Dto {
  messageCode: string;
  message: string;
  responseMessageAttributes: HttpResponseMessageResponseMessageAttribute[];
  subMessages: HttpResponseSubMessageV12Dto[];
}

export interface ValidationResult {
  errorCode: string;
  message: string;
  arguments: any[];
}

export interface HttpResponseSubMessageV12Dto {
  messageCode: string;
  message: string;
  responseMessageAttributes: HttpResponseMessageResponseMessageAttribute[];
}

export interface HttpResponseMessageResponseMessageAttribute {
  key: string;
  value: string;
}
