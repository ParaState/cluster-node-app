import { ReactNode } from 'react';

import { Card, Stack, SxProps, Typography } from '@mui/material';

type Props = {
  title: ReactNode;
  children: ReactNode;
  sx?: SxProps;
};

export const CommonCard = ({ title, children, sx = {} }: Props) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3.75,
        ...sx,
      }}
    >
      <Stack spacing={4} height="100%" justifyContent="space-between">
        <Typography variant="caption" color="white" fontSize={18} component="div">
          {title}
        </Typography>
        {children}
      </Stack>
    </Card>
  );
};
