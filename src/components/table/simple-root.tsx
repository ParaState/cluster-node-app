import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { alpha, Theme, SxProps } from '@mui/material/styles';

import { rootProps } from './types';

type Props = {
  root: rootProps;

  sx?: SxProps<Theme>;
};

export default function SimpleRoot({ root, sx }: Props) {
  return (
    <Card
      sx={{
        py: 2,
        px: 4,
        boxShadow: 'none',
        borderRadius: 1.5,
        display: 'inline-flex',
        color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : 'primary.lighter'),
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        ...sx,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">{`Time: ${root.time} ms`}</Typography>
        <Typography variant="subtitle2">{`Epoch: ${root.epoch}`}</Typography>
        <Typography variant="subtitle2">{`Slot: ${root.slot}`}</Typography>
      </Stack>
    </Card>
  );
}
