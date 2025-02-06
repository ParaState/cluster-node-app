import { Box } from '@mui/material';

import { HEADER } from '@/layouts/config-layout';

export const FixedHeader = () => {
  return (
    <Box
      sx={{
        height: {
          xs: HEADER.H_MOBILE,
          md: HEADER.H_DESKTOP,
        },
      }}
    />
  );
};
