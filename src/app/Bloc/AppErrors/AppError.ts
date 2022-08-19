
export enum AppErrorCode {
  MAXIMUM_FILES_EXCEEDED="MAXIMUM_FILES_EXCEEDED",
  LIMIT_EXCEEDED="LIMIT_EXCEEDED",
  FILE_WITH_SAME_NAME="FILE_WITH_SAME_NAME",
  FOLDER_NOT_FOUND="FOLDER_NOT_FOUND",
  NO_FILES_AVAILABLE="NO_FILES_AVAILABLE",
}

export interface ErrorParams{
  errorCode?:AppErrorCode;
  title?:string;
  message?:string;
}

export class AppError extends Error{

  errorCode:AppErrorCode;

  constructor(errorCode: AppErrorCode,message: string) {
    super(message);
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
