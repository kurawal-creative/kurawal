import { Response } from "express";

interface SuccessResponseOptions {
  data?: any;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ErrorResponseOptions {
  message: string;
  error?: string;
  statusCode?: number;
}

export const sendSuccess = (res: Response, options: SuccessResponseOptions, statusCode: number = 200) => {
  const response: any = {
    success: true,
  };

  if (options.message) {
    response.message = options.message;
  }

  if (options.data !== undefined) {
    response.data = options.data;
  }

  if (options.pagination) {
    response.pagination = options.pagination;
  }

  res.status(statusCode).json(response);
};

export const sendError = (res: Response, options: ErrorResponseOptions) => {
  const statusCode = options.statusCode || 500;
  const response: any = {
    success: false,
    message: options.message,
  };

  if (options.error) {
    response.error = options.error;
  }

  res.status(statusCode).json(response);
};

export const handleError = (res: Response, error: unknown, defaultMessage: string) => {
  console.error(`${defaultMessage}:`, error);
  sendError(res, {
    message: defaultMessage,
    error: error instanceof Error ? error.message : "Unknown error",
    statusCode: 500,
  });
};
