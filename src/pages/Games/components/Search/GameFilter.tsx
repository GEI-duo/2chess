import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded';
import MoreTimeRoundedIcon from '@mui/icons-material/MoreTimeRounded';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAtom } from 'jotai';
import {
  filtersAtom,
  fromDateAtom,
  toDateAtom,
  playTimeAtom,
  incrementAtom,
} from '@/pages/Games/state/gameFilters';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { DateValidationError } from '@mui/x-date-pickers';

function distributed_marks(labels: string[]) {
  return labels.map((label, index) => ({
    value: index,
    label,
  }));
}

type FilterOption = {
  category: string;
  label: string;
  value: string;
};

export default function GameFilter() {
  const { t } = useTranslation();

  const smallMediaQuery = useMediaQuery('(max-width:600px)');

  const [filters, setFilters] = useAtom(filtersAtom);
  const [fromDate, setFromDate] = useAtom(fromDateAtom);
  const [toDate, setToDate] = useAtom(toDateAtom);

  const [playTime, setPlayTime] = useAtom(playTimeAtom);
  const [increment, setIncrement] = useAtom(incrementAtom);

  const [fromDateError, setFromDateError] = useState<DateValidationError>(null);
  const [toDateError, setToDateError] = useState<DateValidationError>(null);

  const formatDateError = (error: DateValidationError) => {
    switch (error) {
      case 'invalidDate':
        return t('invalid_date_error');
      case 'minDate':
        return t('min_date_error');
      case 'maxDate':
        return t('max_date_error');
      default:
        return null;
    }
  };

  const statusOptions: FilterOption[] = [
    { category: t('status'), label: t('in_progress'), value: 'inProgress' },
    { category: t('status'), label: t('finished'), value: 'finished' },
  ];

  const turnOptions: FilterOption[] = [
    { category: t('turn'), label: t('white'), value: 'white' },
    { category: t('turn'), label: t('black'), value: 'black' },
  ];

  const timerOptions: FilterOption[] = [
    { category: t('timer'), label: t('playing'), value: 'playing' },
    { category: t('timer'), label: t('paused'), value: 'paused' },
  ];

  const finalizationOptions: FilterOption[] = [
    {
      category: t('finalization'),
      label: t('surrender'),
      value: 'surrender',
    },
    { category: t('finalization'), label: t('timeout'), value: 'timeout' },
    {
      category: t('finalization'),
      label: t('checkmate'),
      value: 'checkmate',
    },
    {
      category: t('finalization'),
      label: t('stalemate'),
      value: 'stalemate',
    },
    {
      category: t('finalization'),
      label: t('insufficient_material'),
      value: 'insufficientMaterial',
    },
    {
      category: t('finalization'),
      label: t('threefold_repetition'),
      value: 'threefoldRepetition',
    },
    {
      category: t('finalization'),
      label: t('fifty_moves'),
      value: 'fiftyMoves',
    },
  ];

  const filterOptions = [
    ...statusOptions,
    ...turnOptions,
    ...timerOptions,
    ...finalizationOptions,
  ];

  const getFilterOptions = (values: GameFilter[]) => {
    return filterOptions.filter(option =>
      values.includes(option.value as GameFilter),
    );
  };

  const setFilterOptions = (values: FilterOption[]) => {
    const options = values.map(option => option.value);
    const isInProgress = options.includes('inProgress');
    const isFinished = options.includes('finished');

    const inProgressDerivedOptions = [
      ...turnOptions.map(option => option.value),
      ...timerOptions.map(option => option.value),
    ];
    const finishedDerivedOptions = [
      ...finalizationOptions.map(option => option.value),
    ];

    const excludedOptions = [
      ...(!isInProgress ? inProgressDerivedOptions : []),
      ...(!isFinished ? finishedDerivedOptions : []),
    ];

    const newOptions = options.filter(
      option => !excludedOptions.includes(option),
    ) as GameFilter[];

    setFilters(newOptions);
  };

  const getOptions = () => {
    const isInProgress = filters.includes('inProgress');
    const isFinished = filters.includes('finished');

    return [
      ...statusOptions,
      ...(isInProgress ? turnOptions : []),
      ...(isInProgress ? timerOptions : []),
      ...(isFinished ? finalizationOptions : []),
    ];
  };

  const playTimeItems: PlayTimeMap = {
    '0': {
      label: '0',
      value: 0,
    },
    '1min': {
      label: `1 ${t('min')}`,
      value: 60,
    },
    '3min': {
      label: `3 ${t('min')}`,
      value: 180,
    },
    '5min': {
      label: `5 ${t('min')}`,
      value: 300,
    },
    '10min': {
      label: `10 ${t('min')}`,
      value: 600,
    },
    '30min': {
      label: `30 ${t('min')}`,
      value: 1800,
    },
    '1h': {
      label: `1 ${t('hour')}`,
      value: 3600,
    },
    '1d': {
      label: `1 ${t('day')}`,
      value: 86400,
    },
    '3d': {
      label: `3 ${t('days')}`,
      value: 259200,
    },
    '1w': {
      label: `7 ${t('days')}`,
      value: 604800,
    },
    inf: {
      label: t('inf'),
      value: Infinity,
    },
  };

  let playTimeMarks = distributed_marks(
    Object.values(playTimeItems).map(v => v.label),
  );
  if (smallMediaQuery) {
    playTimeMarks = playTimeMarks.filter((_, index) => index % 2 === 0);
  }

  const playTimeSliderIndex = () => {
    const minPlayTime = (playTime && playTime[0]) ?? '0';
    const maxPlayTime = (playTime && playTime[1]) ?? 'inf';

    const minIndex =
      minPlayTime !== null
        ? Object.keys(playTimeItems).indexOf(minPlayTime)
        : 0;
    const maxIndex =
      maxPlayTime !== null
        ? Object.keys(playTimeItems).indexOf(maxPlayTime)
        : Object.keys(playTimeItems).length - 1;

    return [minIndex, maxIndex];
  };

  const handlePlayTimeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const minPlayTime = Object.keys(playTimeItems)[newValue[0]] as PlayTime;
      const maxPlayTime = Object.keys(playTimeItems)[newValue[1]] as PlayTime;

      setPlayTime([minPlayTime, maxPlayTime]);
    } else {
      const minPlayTime = Object.keys(playTimeItems)[newValue] as PlayTime;

      setPlayTime([minPlayTime, minPlayTime]);
    }
  };

  const playTimeLabelFormat = (value: number) => {
    return Object.values(playTimeItems)[value].label;
  };

  const incrementItems: IncrementMap = {
    '0': {
      label: '0',
      value: 0,
    },
    '1s': {
      label: `1 ${t('s')}`,
      value: 1,
    },
    '2s': {
      label: `2 ${t('s')}`,
      value: 2,
    },
    '3s': {
      label: `3 ${t('s')}`,
      value: 3,
    },
    '5s': {
      label: `5 ${t('s')}`,
      value: 5,
    },
    '10s': {
      label: `10 ${t('s')}`,
      value: 10,
    },
    '30s': {
      label: `30 ${t('s')}`,
      value: 30,
    },
    '1min': {
      label: `1 ${t('min')}`,
      value: 60,
    },
    inf: {
      label: t('inf'),
      value: Infinity,
    },
  };

  let incrementMarks = distributed_marks(
    Object.values(incrementItems).map(v => v.label),
  );
  if (smallMediaQuery) {
    incrementMarks = incrementMarks.filter((_, index) => index % 2 === 0);
  }

  const incrementSliderIndex = () => {
    const minIncrement = (increment && increment[0]) ?? '0';
    const maxIncrement = (increment && increment[1]) ?? 'inf';

    const minIndex =
      minIncrement !== null
        ? Object.keys(incrementItems).indexOf(minIncrement)
        : 0;
    const maxIndex =
      maxIncrement !== null
        ? Object.keys(incrementItems).indexOf(maxIncrement)
        : Object.keys(incrementItems).length - 1;

    return [minIndex, maxIndex];
  };

  const handleIncrementChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    if (Array.isArray(newValue)) {
      const minIncrement = Object.keys(incrementItems)[
        newValue[0]
      ] as Increment;
      const maxIncrement = Object.keys(incrementItems)[
        newValue[1]
      ] as Increment;

      setIncrement([minIncrement, maxIncrement]);
    } else {
      const minIncrement = Object.keys(incrementItems)[newValue] as Increment;

      setIncrement([minIncrement, minIncrement]);
    }
  };

  const incrementLabelFormat = (value: number) => {
    return Object.values(incrementItems)[value].label;
  };

  return (
    <Box className="flex flex-col gap-4 mt-4">
      <Autocomplete
        multiple
        id="filters"
        options={getOptions()}
        groupBy={option => option.category}
        value={getFilterOptions(filters)}
        onChange={(_event, newValue: any) => setFilterOptions(newValue)}
        disableCloseOnSelect
        getOptionLabel={option => option.label}
        noOptionsText={t('no_options')}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label={t('filters')}
            placeholder={t('filters')}
          />
        )}
      />
      <Box className="flex gap-2">
        <DatePicker
          value={fromDate}
          onChange={(value, context) => {
            if (context.validationError === null) {
              setFromDate(value);
            }
          }}
          onError={error => setFromDateError(error)}
          slotProps={{
            textField: {
              helperText: formatDateError(fromDateError),
            },
            actionBar: {
              actions: ['clear'],
            },
            field: {
              clearable: true,
            },
          }}
          className="flex-1"
          disableFuture
          label={t('start_date')}
        />
        <DatePicker
          value={toDate}
          onChange={(value, context) => {
            if (context.validationError === null) {
              setToDate(value);
            }
          }}
          onError={error => setToDateError(error)}
          slotProps={{
            textField: {
              helperText: formatDateError(toDateError),
            },
            actionBar: {
              actions: ['clear'],
            },
            field: {
              clearable: true,
            },
          }}
          className="flex-1"
          minDate={fromDate}
          disableFuture
          label={t('end_date')}
        />
      </Box>
      <Box className="flex flex-col gap-1">
        <Box
          className="flex items-center gap-2"
          sx={{ color: 'text.secondary' }}
        >
          <AvTimerRoundedIcon sx={{ fontSize: '1.3rem' }} />
          <Typography variant="body2">{t('play_time')}</Typography>
        </Box>
        <Box className="flex px-2">
          <Slider
            value={playTimeSliderIndex()}
            onChange={handlePlayTimeChange}
            valueLabelDisplay="auto"
            getAriaValueText={playTimeLabelFormat}
            valueLabelFormat={playTimeLabelFormat}
            max={Object.keys(playTimeItems).length - 1}
            marks={playTimeMarks}
          />
        </Box>
      </Box>
      <Box className="flex flex-col gap-1">
        <Box
          className="flex items-center gap-2"
          sx={{ color: 'text.secondary' }}
        >
          <MoreTimeRoundedIcon sx={{ fontSize: '1.25rem' }} />
          <Typography variant="body2">{t('increment')}</Typography>
        </Box>
        <Box className="flex px-2">
          <Slider
            value={incrementSliderIndex()}
            onChange={handleIncrementChange}
            valueLabelDisplay="auto"
            getAriaValueText={incrementLabelFormat}
            valueLabelFormat={incrementLabelFormat}
            max={Object.keys(incrementItems).length - 1}
            marks={incrementMarks}
          />
        </Box>
      </Box>
    </Box>
  );
}
