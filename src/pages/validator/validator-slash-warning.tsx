import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Container, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';

import { config } from '@/config';
import { useSelectedOperators } from '@/stores';

import { CommonBack } from '@/components/common';
import { ValidatorBeachonLink } from '@/components/validator';

export default function ValidatorSlashWarningPage() {
  const router = useRouter();

  const { keyStorePublicKeys } = useSelectedOperators();

  const checked = useBoolean(false);

  return (
    <Container maxWidth="md">
      <CommonBack />
      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h2" textAlign="center" py={2}>
          Slashing
          <Typography display="inline" variant="inherit" color="error.main" px={1}>
            Warning
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          <Typography variant="body1" mb={2}>
            Your validator is currently present on the beacon chain
          </Typography>

          {keyStorePublicKeys.map((pk, index) => (
            <ValidatorBeachonLink pk={pk} key={index} />
          ))}

          <Typography variant="body1" mb={2}>
            Running a validator simultaneously to the SafeStake network will cause slashing to your
            validator.
          </Typography>

          <Stack
            onClick={() => {
              checked.onToggle();
            }}
            direction="row"
            alignItems="center"
            mb={2}
            spacing={1}
            sx={{ cursor: 'pointer' }}
          >
            <Checkbox checked={checked.value} />
            <Typography variant="body1">
              To avoid slashing, shut down your existing validator setup before importing your
              validator to run with our network.
            </Typography>
          </Stack>

          <Stack sx={{ mx: 'auto' }}>
            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="soft"
              loading={false}
              disabled={!checked.value}
              onClick={() => {
                router.push(config.routes.validator.confirm);
              }}
            >
              Next
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
