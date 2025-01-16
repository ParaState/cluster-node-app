import Container from '@mui/material/Container';
import { Card, Stack, Button, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { config } from '@/config';

import SurveyComponent from '@/components/survey';
import { useSettingsContext } from '@/components/settings';

export default function ValidatorSuccessView() {
  const settings = useSettingsContext();
  const router = useRouter();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card sx={{ py: 6, px: { md: 4, xs: 2 }, maxWidth: 'sm', margin: '0 auto', my: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Welcome to the SafeStake Network!</Typography>
          <Typography variant="body1">
            Your validator is now running on the robust and secure infrastructure of our network.
          </Typography>
          <Typography variant="body1">
            View your validators performance in the SafeStake network explorer.
          </Typography>

          <Typography variant="h6" pb={2}>
            It will take a few minutes for your validator to be updated in My Account.
          </Typography>
          <Button
            color="info"
            size="large"
            type="submit"
            variant="soft"
            onClick={() => {
              router.replace(config.routes.dashboard);
            }}
          >
            View Validator
          </Button>
        </Stack>
      </Card>

      <SurveyComponent />
    </Container>
  );
}
