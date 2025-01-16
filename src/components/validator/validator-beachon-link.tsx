import { Paper, Stack, IconButton, Typography } from '@mui/material';

import { getBaseBeaconchaUrl } from '@/utils/beaconcha';

import Iconify from '@/components/iconify';

type Props = {
  pk: string;
};

export const ValidatorBeachonLink = ({ pk }: Props) => {
  if (!pk) return '';

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.grey[300],
        borderRadius: 1,
        mb: 2,
        height: 50,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography
          color="text.secondary"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexGrow: 1,
          }}
        >
          {pk}
        </Typography>
        <IconButton
          sx={{
            flexShrink: 0,
          }}
          target="_blank"
          href={`${getBaseBeaconchaUrl()}/validator/${pk}`}
        >
          <Iconify width={26} icon="mingcute:radar-2-line" className="caption" />
        </IconButton>
      </Stack>
    </Paper>
  );
};
