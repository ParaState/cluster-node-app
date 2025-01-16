import { ReactNode } from 'react';

import { Card, Stack, Typography } from '@mui/material';

import { primary, primaryDark } from '@/theme/palette';

type Props = {
  title: string;
  type: 'validator' | 'operator';
  children: ReactNode;
};

export const CommonCard = ({ title, type, children }: Props) => {
  const isValidator = type === 'validator';
  // console.log('bgcolor', type, bgcolor);

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: isValidator ? primary.main : primaryDark.main,
        height: '100%',
        borderRadius: 3.75,
      }}
    >
      <Stack spacing={4} height="100%" justifyContent="space-between">
        <Typography variant="caption" color="white" fontSize={18}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Card>
  );
};
