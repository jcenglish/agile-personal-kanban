export class ApiError extends Error {
  status?: number;
  original?: unknown;
  constructor(status?: number, message?: string, original?: unknown) {
    super(message ?? "API error");
    this.status = status;
    this.original = original;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

import type { AxiosError } from "axios";
export function fromAxiosError(err: AxiosError): ApiError {
  return new ApiError(err.response?.status, err.message, err);
}