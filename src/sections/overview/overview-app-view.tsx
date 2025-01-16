import { useAccount } from 'wagmi';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract/cluster-node';

import services from '@/services';
import { config } from '@/config';
import { useBoolean } from '@/hooks';
import { HEADER } from '@/layouts/config-layout';
import { IResponseInitiatorStatus } from '@/types';

import LoadingScreen from '@/components/loading-screen/loading-screen';

import AppWidget from './app-widget';
import AppAreaInstalled from './app-area-installed';
import AppWidgetSummary from './app-widget-summary';
import AppCurrentDownload from './app-current-download';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const router = useRouter();

  const theme = useTheme();

  const loading = useBoolean();

  const registerClusterNodeLoading = useBoolean();

  const { address } = useAccount();

  const { getClusterNode, registerClusterNode } = useClusterNode();

  const [clusterNode, setClusterNode] = useState<Awaited<ReturnType<typeof getClusterNode>>>();

  const [statusText, setStatusText] = useState<string>('');

  const [initiatorStatus, setInitiatorStatus] = useState<IResponseInitiatorStatus>();

  const { enqueueSnackbar } = useSnackbar();

  // not registered
  // {
  //   "code": 200,
  //   "message": "ok",
  //   "data": {
  //     "cluster_pubkey": "0x02f2af66dcd421515279e16cb40714d241f14dfe12666b6e36901c71e9df2d9eab",
  //     "created_at": 1736822759,
  //     "owner": null,
  //     "status": "Ready",
  //     "updated_at": 1736823745
  //   }
  // }

  const fetchClusterNode = async () => {
    try {
      loading.onTrue();
      setStatusText('');

      const result = await services.clusterNode.getInitiatorStatus();
      setInitiatorStatus(result);

      const node = await getClusterNode(result?.cluster_pubkey!);
      setClusterNode(node);
    } catch (error) {
      if (error?.data?.code === 1001) {
        setStatusText(
          `Please set cluster node service first. Error Message: ${error.data.message}`
        );
        return;
      }

      if (error instanceof AxiosError) {
        if (error?.status && error?.status >= 400 && error?.status < 599) {
          setStatusText(`Server error: ${error.status}, please set cluster node service first.`);
        }
      }
      console.error('Error fetching cluster node:', error);
    } finally {
      loading.onFalse();
    }
  };

  useEffect(() => {
    fetchClusterNode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const registerClusterNodeClick = async () => {
    const pubkey = initiatorStatus?.cluster_pubkey;

    if (!pubkey) {
      enqueueSnackbar('Please get public key first', { variant: 'error' });
      return;
    }

    try {
      registerClusterNodeLoading.onTrue();
      const result = await registerClusterNode(pubkey!);

      console.log('🚀 ~ registerClusterNodeClick ~ result:', result);
      await fetchClusterNode();
    } catch (error) {
      console.error('Error registering cluster node:', error);
    } finally {
      registerClusterNodeLoading.onFalse();
    }
  };

  const bindInitiatorOwner = async () => {
    if (initiatorStatus?.status !== 'Ready') {
      enqueueSnackbar('Please wait for initiator status to be ready', { variant: 'error' });
      await fetchClusterNode();
      return;
    }

    try {
      await services.clusterNode.bindInitiatorOwner(address!);
      enqueueSnackbar('Bind initiator owner success', { variant: 'success' });
      await fetchClusterNode();
    } catch (error) {
      console.error('Error binding initiator owner:', error);
    }
  };

  if (loading.value) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <LoadingScreen />
      </Box>
    );
  }

  if (statusText) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h6">{statusText}</Typography>
      </Container>
    );
  }

  console.log('🚀 ~ OverviewAppView ~ clusterNode:', clusterNode);

  if (!clusterNode?.isRegistered) {
    return (
      <Container
        maxWidth="xl"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            height: {
              xs: HEADER.H_MOBILE,
              md: HEADER.H_DESKTOP,
            },
          }}
        />
        <Typography variant="h6" mb={2}>
          Please register cluster node first.
        </Typography>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={registerClusterNodeClick}
          loading={registerClusterNodeLoading.value}
        >
          Register Cluster Node
        </LoadingButton>
      </Container>
    );
  }

  if (clusterNode?.isRegistered && !initiatorStatus?.owner) {
    // registered
    // {
    //   "code": 200,
    //   "message": "ok",
    //   "data": {
    //     "cluster_pubkey": "0x02f2af66dcd421515279e16cb40714d241f14dfe12666b6e36901c71e9df2d9eab",
    //     "created_at": 1736822759,
    //     "owner": "0xE9ff6124688E153a57AB70c7869d8B235c1BE781",
    //     "status": "Completed",
    //     "updated_at": 1736825737
    //   }
    // }

    return (
      <Container
        maxWidth="xl"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            height: {
              xs: HEADER.H_MOBILE,
              md: HEADER.H_DESKTOP,
            },
          }}
        />
        <Typography variant="h6" mb={2}>
          Please bind initiator owner first.
        </Typography>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={bindInitiatorOwner}
          loading={registerClusterNodeLoading.value}
        >
          Bind Initiator Owner
        </LoadingButton>
      </Container>
    );
  }

  if (initiatorStatus?.status === 'Completed') {
    return (
      <Container
        maxWidth="xl"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            height: {
              xs: HEADER.H_MOBILE,
              md: HEADER.H_DESKTOP,
            },
          }}
        />
        <Typography variant="h6" mb={2}>
          Go to select operators.
        </Typography>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={() => {
            router.push(config.routes.validator.selectOperators);
          }}
          loading={registerClusterNodeLoading.value}
        >
          Go to select operators
        </LoadingButton>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
        }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
