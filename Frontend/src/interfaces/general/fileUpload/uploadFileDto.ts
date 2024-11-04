import { UploadActionEnum } from "interfaces/enums/GlobalEnums";
import { ValidationResult } from "interfaces/v12/exceptions/HttpResponseMessageV12Dto";

export interface UploadFileDto {
  fileBase64String: string | ArrayBuffer | null | undefined;
  fileName: string;
  fileType: string;
  columnDelimiter?: string | null;
  textQualifier?: string | null;
}

export interface UploadValidationResult {
  line: number;
  validationResults: ValidationResult[];
}

export interface UploadResult {
  line: number;
  action: UploadActionEnum;
  nameIdentifier: string;
}

export interface UploadResults {
  validationResults: UploadValidationResult[];
  created: UploadResult[];
  updated: UploadResult[];
  failed: number;
}
