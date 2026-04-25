import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';

interface TimerProps {
  time: number;
  variant: NonNullable<TypographyProps['variant']>;
}

export default function Timer({ time, variant }: TimerProps) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  const minutesString = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const secondsString = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    maximumFractionDigits: 0,
  });

  return (
    <Typography variant={variant}>
      {minutesString}:{secondsString}
    </Typography>
  );
}
