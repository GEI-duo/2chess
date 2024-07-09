import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { Box, Skeleton, Stack } from '@mui/material';

export default function GamePreviewSkeleton() {
  return (
    <Card>
      <CardHeader
        title={<Skeleton width="50%" />}
        subheader={<Skeleton width="70%" />}
        action={<Skeleton variant="circular" width={40} height={40} />}
        sx={{ pb: 1 }}
      ></CardHeader>
      <Stack
        direction="row"
        spacing={1}
        className="mx-4 overflow-x-auto h-6 items-center"
      >
        <Skeleton variant="rounded" width="20%" />
        <Skeleton variant="rounded" width="30%" />
      </Stack>
      <CardContent className="flex flex-col h-fit gap-2">
        <Box className="flex gap-2 items-center">
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            className="aspect-square"
          />
          <Skeleton variant="rectangular" width="100%" />
        </Box>
        <CardActionArea>
          <CardMedia className="flex w-full aspect-square">
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </CardMedia>
        </CardActionArea>
        <Box className="flex gap-4 items-center">
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            className="aspect-square"
          />
          <Skeleton variant="rectangular" width="100%" />
        </Box>
      </CardContent>
    </Card>
  );
}
