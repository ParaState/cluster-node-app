import { useAccount } from 'wagmi';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, styled, Divider, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract/cluster-node';

import services from '@/services';
import { config } from '@/config';
import { useBoolean } from '@/hooks';
import { HEADER } from '@/layouts/config-layout';
import { IResponseInitiatorStatus } from '@/types';

import Iconify from '@/components/iconify';
import LoadingScreen from '@/components/loading-screen/loading-screen';

const CircleBox = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const yesIcon = <Iconify color="#21D7B5" textAlign="center" icon="healthicons:yes" />;

const SetupItem = ({
  title,
  description,
  checked,
  onClick,
  index,
  divider = true,
  buttonText = 'check',
  loading = false,
  disabled = false,
}: {
  loading?: boolean;
  index: string;
  title: string;
  description?: React.ReactNode;
  checked: boolean;
  onClick: () => void;
  divider?: boolean;
  buttonText?: string;
  disabled?: boolean;
}) => {
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2}>
          <CircleBox>{index}</CircleBox>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{title}</Typography>
            {checked && yesIcon}
          </Stack>
        </Stack>
        <LoadingButton
          loading={loading}
          variant="contained"
          size="small"
          onClick={onClick}
          sx={{
            textTransform: 'capitalize',
            minWidth: 80,
          }}
          disabled={disabled}
        >
          {buttonText}
        </LoadingButton>
      </Stack>
      {description}
      {divider && <Divider />}
    </>
  );
};

export default function OverviewAppView() {
  const router = useRouter();

  const loading = useBoolean();

  const registerClusterNodeLoading = useBoolean();

  const { address } = useAccount();

  const { getClusterNode, registerClusterNode } = useClusterNode();

  const [clusterNode, setClusterNode] = useState<Awaited<ReturnType<typeof getClusterNode>>>();

  // const [serviceErrorText, setServiceErrorText] = useState<string>('');

  // const [initiatorErrorText, setInitiatorErrorText] = useState<string>('');

  const [initiatorStatus, setInitiatorStatus] = useState<IResponseInitiatorStatus>();

  const { enqueueSnackbar } = useSnackbar();

  const serviceOk = useBoolean(false);

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

  const getInitiatorStatus = async () => {
    try {
      // setServiceErrorText('');

      const result = await services.clusterNode.getInitiatorStatus();
      setInitiatorStatus(result);
      serviceOk.onTrue();
      return result;
    } catch (error) {
      if (error?.data?.code === 1001) {
        // setServiceErrorText(
        //   `Please set cluster node service first. Error Message: ${error.data.message}`
        // );
        enqueueSnackbar(
          `Please set cluster node service first. Error Message: ${error.data.message}`,
          { variant: 'error' }
        );
      }

      if (error instanceof AxiosError) {
        if (error?.status && error?.status >= 400 && error?.status < 599) {
          enqueueSnackbar(`Server error: ${error.status}, please set cluster node service first.`, {
            variant: 'error',
          });
          // setServiceErrorText(
          //   `Server error: ${error.status}, please set cluster node service first.`
          // );
        }
      }
      serviceOk.onFalse();
      console.error('Error fetching cluster node:', error);
      throw error;
    }
  };

  const fetchClusterNode = async () => {
    try {
      loading.onTrue();

      const result = await getInitiatorStatus();

      const node = await getClusterNode(result?.cluster_pubkey!);
      setClusterNode(node);
      // if (node.isRegistered && node.owner) {
      //   setInitiatorErrorText('');
      // } else {
      //   setInitiatorErrorText('Please bind your initiator owner first');
      // }
    } catch (error) {
      // if (error?.data?.code === 1001) {
      //   setServiceErrorText(
      //     `Please set cluster node service first. Error Message: ${error.data.message}`
      //   );
      //   return;
      // }

      // if (error instanceof AxiosError) {
      //   if (error?.status && error?.status >= 400 && error?.status < 599) {
      //     setServiceErrorText(
      //       `Server error: ${error.status}, please set cluster node service first.`
      //     );
      //   }
      // }
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
    if (initiatorStatus?.owner) {
      enqueueSnackbar(`Initiator already have owner, address: ${initiatorStatus?.owner}`, {
        variant: 'warning',
      });
      return;
    }

    if (initiatorStatus?.status !== 'Ready') {
      enqueueSnackbar(
        `Please wait for initiator status to be ready, status: ${initiatorStatus?.status}`,
        {
          variant: 'warning',
        }
      );
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

  const goToSelectOperators = () => {
    if (!initiatorStatus?.owner) {
      enqueueSnackbar('Please bind your initiator owner first', { variant: 'warning' });
      return;
    }

    if (initiatorStatus?.owner !== address) {
      enqueueSnackbar(
        `You are not the owner of the initiator, owner address: ${initiatorStatus?.owner}`,
        {
          variant: 'warning',
        }
      );
      return;
    }

    if (initiatorStatus?.status !== 'Completed') {
      enqueueSnackbar(
        `Please wait for initiator status to be completed, status: ${initiatorStatus?.status}`,
        {
          variant: 'warning',
        }
      );
      return;
    }

    router.push(config.routes.validator.selectOperators);
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

  // if (statusText) {
  //   return (
  //     <Container maxWidth="xl">
  //       <Typography variant="h6">{statusText}</Typography>
  //     </Container>
  //   );
  // }

  // console.log('🚀 ~ OverviewAppView ~ clusterNode:', clusterNode);

  // if (!clusterNode?.isRegistered) {
  //   return (
  //     <Container
  //       maxWidth="xl"
  //       sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
  //     >
  //       <Box
  //         sx={{
  //           height: {
  //             xs: HEADER.H_MOBILE,
  //             md: HEADER.H_DESKTOP,
  //           },
  //         }}
  //       />
  //       <Typography variant="h6" mb={2}>
  //         Please register cluster node first.
  //       </Typography>
  //       <LoadingButton
  //         variant="contained"
  //         color="primary"
  //         onClick={registerClusterNodeClick}
  //         loading={registerClusterNodeLoading.value}
  //       >
  //         Register Cluster Node
  //       </LoadingButton>
  //     </Container>
  //   );
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

      <Typography variant="h2" py={10}>
        <Typography display="inline" variant="inherit" color="primary.main" px={1}>
          Cluster Node
        </Typography>
        Setup Instructions
      </Typography>

      <Card sx={{ p: 3, py: 4, minWidth: 600 }}>
        <Stack direction="column" spacing={2}>
          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={2}>
              <CircleBox>1</CircleBox>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body1">Check your service is available</Typography>
                {serviceOk.value && yesIcon}
              </Stack>
            </Stack>
            <LoadingButton variant="contained" size="small" onClick={getInitiatorStatus}>
              Check
            </LoadingButton>
          </Stack>
          {serviceErrorText && (
            <Typography variant="body1" color="error">
              {serviceErrorText}
            </Typography>
          )} */}
          <SetupItem
            index="1"
            title="Check your service is available"
            // description={
            //   serviceErrorText && (
            //     <Typography variant="body1" color="error">
            //       {serviceErrorText}
            //     </Typography>
            //   )
            // }
            checked={serviceOk.value}
            onClick={getInitiatorStatus}
          />

          <SetupItem
            index="2"
            title="Register cluster node into contract"
            checked={!!clusterNode?.isRegistered}
            onClick={registerClusterNodeClick}
            buttonText="register"
            disabled={clusterNode?.isRegistered}
            loading={registerClusterNodeLoading.value}
          />

          <SetupItem
            index="3"
            title="Bind your initiator owner with address"
            checked={!!initiatorStatus?.owner}
            onClick={bindInitiatorOwner}
            buttonText="bind"
          />

          <SetupItem
            index="4"
            title="Select operators to generate deposit data"
            checked={initiatorStatus?.status === 'Completed' && initiatorStatus?.owner === address}
            onClick={goToSelectOperators}
            buttonText="run"
            divider={false}
          />

          {/* <Stack direction="row" spacing={2}>
            <CircleBox>2</CircleBox>
            <Typography variant="body1" gutterBottom>
              {`Bind your initiator owner address by clicking "Bind Initiator Owner"`}
            </Typography>
          </Stack>

          <Divider />
          <Stack direction="row" spacing={2}>
            <CircleBox>3</CircleBox>
            <Typography variant="body1" gutterBottom>
              Navigate to the Validator section to create and manage your validators
            </Typography>
          </Stack>
          <Divider />

          <Stack direction="row" spacing={2}>
            <CircleBox>4</CircleBox>
            <Typography variant="body1" gutterBottom>
              Select network operators to run your validator nodes
            </Typography>
          </Stack>
          <Divider />

          <Stack direction="row" spacing={2}>
            <CircleBox>5</CircleBox>
            <Typography variant="body1" gutterBottom>
              Run your validator nodes
            </Typography>
          </Stack> */}
        </Stack>
      </Card>
    </Container>
  );
}
