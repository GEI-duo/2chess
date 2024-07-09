import { atomWithHash } from 'jotai-location';
import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';
import { atom } from 'jotai';

const deleteParam = (key: string) => {
  const params = new URLSearchParams(window.location.hash);
  params.delete(key);
  window.location.hash = params.toString().slice(3); // remove the %23 (# url encoding)
};

const deleteEmptyParam = (
  key: string,
  defaultValue: string | undefined = undefined,
) => {
  return (searchParams: string) => {
    const params = new URLSearchParams(searchParams);
    const value = params.get(key);
    if (value === null || value === '' || value === defaultValue) {
      params.delete(key);
      window.location.hash = params.toString();
    } else {
      window.location.hash = searchParams;
    }
  };
};

export const filtersAtom = atomWithHash('filters', [], {
  serialize: (values: GameFilter[]) => values.join('-'),
  deserialize: (value: string) =>
    (value ? value.split('-') : []) as GameFilter[],
  setHash: deleteEmptyParam('filters'),
});

export const fromDateAtom = atomWithHash('fromDate', null, {
  serialize: (value: Dayjs | null) => (value ? value.format('DD.MM.YYYY') : ''),
  deserialize: (value: string | null) => {
    const date = dayjs(value, 'DD.MM.YYYY');
    if (!date.isValid()) {
      deleteParam('fromDate');
      return null;
    }
    return date;
  },
  setHash: deleteEmptyParam('fromDate'),
});

export const toDateAtom = atomWithHash('toDate', null, {
  serialize: (value: Dayjs | null) => (value ? value.format('DD.MM.YYYY') : ''),
  deserialize: (value: string | null) => {
    const date = dayjs(value, 'DD.MM.YYYY');
    if (!date.isValid()) {
      deleteParam('toDate');
      return null;
    }
    return date;
  },
  setHash: deleteEmptyParam('toDate'),
});

const incrementValues = {
  '0': 0,
  '1s': 1,
  '2s': 2,
  '3s': 3,
  '5s': 5,
  '10s': 10,
  '30s': 30,
  '1min': 60,
  inf: Infinity,
};

const incrementSchema = z.enum(
  Object.keys(incrementValues) as IncrementOptions,
);

export const incrementAtom = atomWithHash<
  [Increment | null, Increment | null] | null
>('increment', null, {
  serialize: (value: [Increment | null, Increment | null] | null) => {
    if (value === null) return '';
    const [minIncrement, maxIncrement] = value;

    if (minIncrement === '0' && maxIncrement === 'inf') {
      return '';
    }

    if (minIncrement !== null && minIncrement === maxIncrement) {
      return minIncrement;
    }

    return `${minIncrement || ''}-${maxIncrement || ''}`;
  },
  deserialize: (value: string) => {
    const values = value.split('-');

    if (values.length > 2) {
      deleteParam('increment');
      return null;
    }

    if (values.length === 1) {
      values.push(values[0]);
    }

    const [minIncrement, maxIncrement] = values;

    let parsedMinIncrement: Increment = '0';
    let parsedMaxIncrement: Increment = 'inf';

    if (minIncrement !== '') {
      const minIncrementResult = incrementSchema.safeParse(minIncrement);
      if (!minIncrementResult.success) {
        deleteParam('increment');
        return null;
      }
      parsedMinIncrement = minIncrementResult.data;
    }

    if (maxIncrement !== '') {
      const maxIncrementResult = incrementSchema.safeParse(maxIncrement);
      if (!maxIncrementResult.success) {
        deleteParam('increment');
        return null;
      }
      parsedMaxIncrement = maxIncrementResult.data;
    }

    const minIncrementIndex =
      Object.keys(incrementValues).indexOf(parsedMinIncrement);
    const maxIncrementIndex =
      Object.keys(incrementValues).indexOf(parsedMaxIncrement);
    if (minIncrementIndex > maxIncrementIndex) {
      deleteParam('increment');
      return null;
    }

    return [parsedMinIncrement, parsedMaxIncrement];
  },
  setHash: deleteEmptyParam('increment', '-'),
});

export const minIncrementAtom = atom(get => {
  const minIncrement = get(incrementAtom)?.[0] ?? null;
  return incrementValues[minIncrement ?? '0'];
});

export const maxIncrementAtom = atom(get => {
  const maxIncrement = get(incrementAtom)?.[0] ?? null;
  return incrementValues[maxIncrement ?? 'inf'];
});

const playTimeValues = {
  '0': 0,
  '1min': 60,
  '3min': 180,
  '5min': 300,
  '10min': 600,
  '30min': 1800,
  '1h': 3600,
  '1d': 86400,
  '3d': 259200,
  '1w': 604800,
  inf: Infinity,
};

const playTimeSchema = z.enum(Object.keys(playTimeValues) as PlayTimeOptions);

export const playTimeAtom = atomWithHash<
  [PlayTime | null, PlayTime | null] | null
>('playTime', null, {
  serialize: (value: [PlayTime | null, PlayTime | null] | null) => {
    if (value === null) return '';
    const [minPlayTime, maxPlayTime] = value;

    if (minPlayTime === '0' && maxPlayTime === 'inf') {
      return '';
    }

    if (minPlayTime !== null && minPlayTime === maxPlayTime) {
      return minPlayTime;
    }

    return `${minPlayTime || ''}-${maxPlayTime || ''}`;
  },
  deserialize: (value: string) => {
    const values = value.split('-');

    if (values.length > 2) {
      deleteParam('playTime');
      return null;
    }

    if (values.length === 1) {
      values.push(values[0]);
    }

    const [minPlayTime, maxPlayTime] = values;

    let parsedMinPlayTime: PlayTime = '0';
    let parsedMaxPlayTime: PlayTime = 'inf';

    if (minPlayTime !== '') {
      const minPlayTimeResult = playTimeSchema.safeParse(minPlayTime);
      if (!minPlayTimeResult.success) {
        deleteParam('playTime');
        return null;
      }
      parsedMinPlayTime = minPlayTimeResult.data;
    }

    if (maxPlayTime !== '') {
      const maxPlayTimeResult = playTimeSchema.safeParse(maxPlayTime);
      if (!maxPlayTimeResult.success) {
        deleteParam('playTime');
        return null;
      }
      parsedMaxPlayTime = maxPlayTimeResult.data;
    }

    const minPlayTimeIndex =
      Object.keys(playTimeValues).indexOf(parsedMinPlayTime);
    const maxPlayTimeIndex =
      Object.keys(playTimeValues).indexOf(parsedMaxPlayTime);
    if (minPlayTimeIndex > maxPlayTimeIndex) {
      deleteParam('playTime');
      return null;
    }

    return [parsedMinPlayTime, parsedMaxPlayTime];
  },
  setHash: deleteEmptyParam('playTime', '-'),
});

export const minPlayTimeAtom = atom(get => {
  const minPlayTime = get(playTimeAtom)?.[0] ?? null;
  return playTimeValues[minPlayTime ?? '0'];
});

export const maxPlayTimeAtom = atom(get => {
  const maxPlayTime = get(playTimeAtom)?.[0] ?? null;
  return playTimeValues[maxPlayTime ?? 'inf'];
});

export const searchAtom = atomWithHash<string>('search', '', {
  setHash: deleteEmptyParam('search', `""`),
});

const sortedSchema = z.enum(['newer', 'older']);
export const sortedAtom = atomWithHash<'newer' | 'older'>('sorted', 'newer', {
  serialize: (value: 'newer' | 'older') => value,
  deserialize: (value: string) => {
    const result = sortedSchema.safeParse(value);
    if (!result.success) {
      deleteParam('sorted');
      return 'newer';
    }
    return result.data;
  },
  setHash: deleteEmptyParam('sorted', 'newer'),
});

const filteredSchema = z.enum(['true', 'false']);
export const filteredAtom = atomWithHash<boolean>('filtered', false, {
  deserialize: (value: string) => {
    const result = filteredSchema.safeParse(value);
    if (!result.success) {
      deleteParam('filtered');
      return false;
    }
    return result.data === 'true';
  },
  setHash: deleteEmptyParam('filtered', 'false'),
});
