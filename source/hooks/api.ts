import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AxiosError } from 'axios';

import { ErrorModel, resolveError } from 'api/utils';
import { notifications } from 'utils/notifications';

type ApiFn<T> = (...args: any) => Promise<T>;

export function useApiCallback<T, Fetch extends ApiFn<T>>(
  fetchFn: FetchFn<T> & Fetch,
  initialState: T,
  fetchOptions?: FetchOptions,
): {
  callback: Fetch;
  data: T;
  isLoading: boolean;
  setData: SetData<T>;
  error?: AxiosError<ErrorModel>;
};
export function useApiCallback<T, Fetch extends ApiFn<T>>(
  fetchFn: FetchFn<T> & Fetch,
): {
  callback: Fetch;
  data?: T;
  isLoading: boolean;
  setData: SetData<T | undefined>;
  error?: AxiosError<ErrorModel>;
};
export function useApiCallback<T, Fetch extends ApiFn<T>>(
  fetchFn: FetchFn<T> & Fetch,
  initialState?: T,
  fetchOptions?: FetchOptions,
) {
  const isDefaultLoading = fetchOptions?.isLoading || false;
  const [state, setState] = useState({
    isLoading: isDefaultLoading,
    data: initialState,
    error: undefined,
  });
  const errorLogging = fetchOptions?.errorLogging;
  const totalCalls = useRef(0);

  const callback: FetchFn<T> = useCallback(
    async (...args) => {
      // We only want to trigger a re-render here if isLoading is not
      // true by default or this is not the first API call
      if (!isDefaultLoading || totalCalls.current > 0) {
        setState(oldState => ({
          ...oldState,
          isLoading: true,
          error: undefined,
        }));
      }

      totalCalls.current += 1;

      try {
        const res = await fetchFn(...args);

        setState({
          isLoading: false,
          error: undefined,
          data: res,
        });
        return res;
      } catch (e) {
        setState(oldState => ({
          ...oldState,
          isLoading: false,
          error: e,
        }));

        if (errorLogging !== false) {
          notifications.error(resolveError(e));
        }
        throw e;
      }
    },
    [isDefaultLoading, fetchFn, errorLogging],
  );

  const setData = useCallback((param: React.SetStateAction<any>) => {
    setState(oldState => ({
      ...oldState,
      data: typeof param === 'function' ? param(oldState.data) : param,
    }));
  }, []);

  return { ...state, callback, setData };
}

export function useApi<T, Fetch extends ApiFn<T>>(
  apiCallback: FetchFn<T> & Fetch,
  initialState: T,
  fetchOptions?: FetchOptions,
): [T, boolean, Properties<T, Fetch>];
export function useApi<T, Fetch extends ApiFn<T>>(
  apiCallback: FetchFn<T> & Fetch,
): [T | undefined, boolean, Properties<T, Fetch>];
export function useApi<T, Fetch extends ApiFn<T>>(
  apiCallback: FetchFn<T> & Fetch,
  initialState?: T,
  fetchOptions?: FetchOptions,
) {
  const fetchData = fetchOptions?.fetchData;
  const { callback, data, setData, isLoading, error } = useApiCallback(apiCallback, initialState, {
    ...fetchOptions,
    isLoading: true,
  });

  useEffect(() => {
    callback(fetchData);
  }, [callback, fetchData]);

  return [data, isLoading, { setData, reFetch: callback, error }];
}

export type SetData<T> = React.Dispatch<React.SetStateAction<T>>;
export type FetchFn<T> = (...args: any) => Promise<T>;

interface Properties<T, Fetch> {
  setData: SetData<T>;
  reFetch: Fetch;
  error?: AxiosError<ErrorModel>;
}

interface FetchOptions {
  fetchData?: any;
  errorLogging?: boolean;
  isLoading?: boolean;
  noLoading?: boolean;
}

export function useApiPoller<T>(
  apiCallback: FetchFn<T>,
  timeout: number,
  options: {
    initialState?: undefined;
    pollCondition?: boolean;
    shouldStop?: (data: T) => boolean;
  } & FetchOptions,
  dependencies?: any[],
): [T | undefined, boolean, ApiPollerParams];
export function useApiPoller<T>(
  apiCallback: FetchFn<T>,
  timeout: number,
  options: {
    initialState?: T;
    pollCondition?: boolean;
    shouldStop?: (data: T) => boolean;
  } & FetchOptions,
  dependencies?: any[],
): [T, boolean, ApiPollerParams];
export function useApiPoller<T>(
  apiCallback: FetchFn<T>,
  timeout: number,
  options?: undefined,
  dependencies?: any[],
): [T | undefined, boolean, ApiPollerParams];
export function useApiPoller<T>(
  apiCallback: FetchFn<T>,
  timeout: number,
  options = {} as ApiPollerOptions<T>,
  dependencies: any[] = [],
) {
  const {
    initialState,
    pollCondition,
    shouldStop,
    errorLogging,
    fetchData,
    isLoading: initialIsLoading,
    noLoading,
  } = options;
  const fetchOptions = useMemo(
    () => ({
      errorLogging,
      fetchData,
      isLoading: initialIsLoading,
      noLoading,
    }),
    [errorLogging, fetchData, initialIsLoading, noLoading],
  );
  const { callback, data, isLoading } = useApiCallback(apiCallback, initialState, fetchOptions);
  const interval = useRef<any>();
  const totCalls = useRef(0);
  const stop = useCallback(() => clearInterval(interval.current), []);

  useEffect(() => {
    stop();

    const callApi = async () => {
      if (!document.hidden) {
        totCalls.current += 1;
        const response = await callback();

        if (pollCondition === false || (shouldStop && shouldStop(response as T))) {
          stop();
        }
      }
    };

    interval.current = setInterval(callApi, timeout * 1000);
    callApi();

    return stop;
  }, [
    stop,
    callback,
    shouldStop,
    pollCondition,
    timeout,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...dependencies,
  ]);

  return [data, isLoading, { totCalls: totCalls.current, stop }];
}

interface ApiPollerOptions<T> extends FetchOptions {
  initialState?: T;
  pollCondition?: boolean;
  shouldStop?: (data: T) => boolean;
}

interface ApiPollerParams {
  totCalls: number;
  stop: () => void;
}
