import { Stack, Button, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import Iconify from '@/components/iconify';

export const CommonBack = () => {
  const router = useRouter();
  return (
    <Stack justifyContent="center" alignItems="center">
      <Button
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" color="text.secondary" />}
        onClick={() => router.back()}
        sx={{ mt: 3, width: 80 }}
      >
        <Typography variant="body1" color="text.secondary">
          Back
        </Typography>
      </Button>
    </Stack>
  );
};
