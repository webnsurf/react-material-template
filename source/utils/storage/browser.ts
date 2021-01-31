import { STORAGE_PREFIX } from 'app-constants';

export const browserStorage = {
  get: <DataType extends any = any>(key: string, noPrefix = false) => {
    const item = window.localStorage.getItem(`${noPrefix ? '' : STORAGE_PREFIX}${key}`);

    if (item) {
      try {
        return JSON.parse(item) as DataType;
      } catch {}
    }

    return item as DataType | null;
  },
  set: (key: string, value: any, noPrefix = false) => {
    let stringData = value;
    try {
      stringData = JSON.stringify(value);
    } catch {}

    return window.localStorage.setItem(`${noPrefix ? '' : STORAGE_PREFIX}${key}`, stringData);
  },
  remove: (key: string, noPrefix = false) =>
    window.localStorage.removeItem(`${noPrefix ? '' : STORAGE_PREFIX}${key}`),
};
