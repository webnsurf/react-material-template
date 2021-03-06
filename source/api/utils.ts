import { AxiosError, AxiosRequestConfig } from 'axios';

export interface ErrorModel {
  message: string;
  statusCode: number;
  fields?: { [key: string]: string };
}

export const resolveError = (rawError?: AxiosError<ErrorModel>): ErrorModel => {
  console.error({ rawError });

  if (rawError) {
    const { response, message } = rawError;
    const { data, status } = response || {};

    return {
      message: data?.message || message || 'Unknown error (FE)',
      statusCode: status || data?.statusCode || 500,
      fields: data?.fields,
    };
  }

  return {
    message: 'Unknown error (FE)',
    statusCode: 0,
  };
};

export const getHeaders = (): AxiosRequestConfig => ({});
