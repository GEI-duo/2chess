import PieceStack from '@/components/PieceStack';
import UserProfile from '@/components/UserProfile';
import Timer from '@/components/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

interface StatsProps {
  color: Color;
  pieces: CapturedPieces;
  score: number;
  time: number;
  username: string;
  active: boolean;
  size?: 'small' | 'medium' | 'compact';
  showTimer?: boolean;
}

const Stats = memo(
  ({
    color,
    pieces,
    time,
    score,
    username,
    active,
    size = 'medium',
    showTimer = true,
  }: StatsProps) => {
    const theme = useTheme();

    return (
      <div
        className={`flex justify-between gap-2 ${
          size === 'compact' ? 'h-8' : 'h-12'
        }`}
        style={{ opacity: active ? 1 : 0.7 }}
      >
        <div className="flex gap-4 flex-grow items-center">
          <UserProfile color={color} />
          <div className="flex-col w-full flex-grow">
            <Typography variant={`${size === 'compact' ? 'body2' : 'body1'}`}>
              {username}
            </Typography>
            {size === 'medium' && (
              <div className="flex gap-2 flex-grow items-end">
                <PieceStack pieces={pieces} />
                <Typography variant="caption">{score}</Typography>
              </div>
            )}
          </div>
        </div>
        {showTimer && (
          <div
            className={`flex min-w-18 shrink gap-2 items-center justify-end rounded-md ${
              size === 'compact' ? 'p-2' : 'p-4'
            }`}
            style={{
              backgroundColor: theme.palette.background.paper,
              color: active
                ? theme.palette.text.primary
                : theme.palette.text.disabled,
            }}
          >
            <AccessTimeIcon
              fontSize={`${size === 'compact' ? 'small' : 'medium'}`}
            />
            <Timer
              time={time}
              variant={`${size === 'compact' ? 'h6' : 'h5'}`}
            />
          </div>
        )}
      </div>
    );
  },
);

export default Stats;
