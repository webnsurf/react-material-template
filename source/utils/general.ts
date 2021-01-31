import { v4 as uuid } from 'uuid';

import { isProduction } from 'app-constants';

export const getRandomId = () => uuid();

export const notEmpty = (value: any) => value !== undefined && value !== null && value !== '';

export const removeEmptyFromObj = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce(
    (acc, current) => ({
      ...acc,
      ...(notEmpty(obj[current]) && { [current]: obj[current] }),
    }),
    {},
  );

export const notNullish = (value: any) => value !== undefined && value !== null;

export const removeNullishFromObj = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce(
    (acc, current) => ({
      ...acc,
      ...(notNullish(obj[current]) && { [current]: obj[current] }),
    }),
    {},
  );

export const getInitials = (string?: string) =>
  string
    ?.split(/\s+/)
    .map(word => word[0].toUpperCase())
    .join('');

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');

  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

export const sleep = (delay = 1000) => new Promise(resolve => setTimeout(resolve, delay));

export class EventEmitter<T = any> {
  private callbacks: EventEmitterCallbackArray<T> = [];

  subscribe(event: EventEmitterEventType, callback: EventEmitterCallback<T>) {
    this.callbacks.push({ event, callback });
  }

  unsubscribe(event: EventEmitterEventType, providedCallback: EventEmitterCallback<T>) {
    const callback = this.callbacks.find(
      item => item.event === event && item.callback === providedCallback,
    );
    const callbackIndex = callback && this.callbacks.indexOf(callback);

    if (callbackIndex !== undefined) {
      this.callbacks.splice(callbackIndex, 1);
    }
  }

  emit(eventType: EventEmitterEventType, data: T) {
    this.callbacks
      .filter(({ event }) => event === eventType)
      .forEach(({ callback }) => callback(data));
  }
}

type EventEmitterEventType = 'change';
type EventEmitterCallback<T> = (data: T) => any;
type EventEmitterCallbackArray<T> = {
  event: EventEmitterEventType;
  callback: EventEmitterCallback<T>;
}[];

export const getObjectValue = (
  path?: string | number | symbol,
  object?: Record<string, any>,
): any =>
  path &&
  String(path)
    .split('.')
    .reduce((value, key) => value && value[key], object);

export const getRandomString = (length = 10, type: 'numbers' | 'chars' | 'full' = 'full') => {
  const numbers = '0123456789';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const string = (() => {
    if (type === 'chars') {
      return chars;
    }
    if (type === 'numbers') {
      return numbers;
    }
    return numbers + chars;
  })();
  let result = '';

  for (let i = length; i > 0; i -= 1) {
    result += string[Math.floor(Math.random() * string.length)];
  }

  return result;
};

export const paddWithZeros = (number: number) => (number > 9 ? String(number) : `0${number}`);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const emptyFn = (..._args: any[]) => {};

export const silentLog: typeof emptyFn =
  !isProduction || window.sessionStorage.log_enabled
    ? Function.prototype.bind.call(console.log, console) // eslint-disable-line no-console
    : emptyFn;

export const concealString = (string?: string, delimeter?: string, revealChars = 3) => {
  if (!string) {
    return '';
  }

  if (delimeter) {
    const [first, last] = string.split(delimeter);
    return `${first.substr(0, revealChars)}···${delimeter}${last}`;
  }

  return `${string.substr(0, revealChars)}···`;
};

export const resolveFileName = (path: string) => {
  const nameParts = path.split('/');
  return nameParts[nameParts.length - 1];
};
