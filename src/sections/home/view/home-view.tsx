import { useAccount } from 'wagmi';

import { Box, Grid, Stack, Container, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { config } from '@/config';
import MainLayout from '@/layouts/main';
import { useOpenWallet } from '@/hooks';
import { HEADER } from '@/layouts/config-layout';

import { CardButton, CommonCard } from '@/components/common';

export default function HomeView() {
  const router = useRouter();

  // const [loading, setLoading] = useState(false);

  const { address } = useAccount();
  const { openWallet } = useOpenWallet();

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box
          sx={{
            height: {
              xs: HEADER.H_MOBILE,
              md: HEADER.H_DESKTOP,
            },
          }}
        />

        <Typography variant="h2" py={6} textAlign="center">
          Join the SafeStake Network
        </Typography>

        <Grid container spacing={2} py={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <CommonCard
              title="To join the network of operators you must run an SafeStake node. "
              type="validator"
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <CardButton
                  text="Run validator"
                  onClick={() => {
                    if (!address) {
                      openWallet();
                    } else {
                      router.push(config.routes.validator.home);
                    }
                  }}
                />
                <Box
                  component="img"
                  alt="validator"
                  src="/images/validator.svg"
                  sx={{
                    width: 48,
                    height: 48,
                  }}
                />
              </Stack>
            </CommonCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <CommonCard
              title="Setup your node, generate operator keys and register to the network."
              type="operator"
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <CardButton
                  text="Run operator"
                  onClick={() => {
                    if (!address) {
                      openWallet();
                    } else {
                      router.push(config.routes.operator.home);
                    }
                  }}
                />
                <Box
                  component="img"
                  alt="validator"
                  src="/images/operator.svg"
                  sx={{
                    width: 48,
                    height: 48,
                  }}
                />
              </Stack>
            </CommonCard>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
