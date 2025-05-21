import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Step,
  Stack,
  Button,
  Stepper,
  StepLabel,
  Container,
  Typography,
  StepContent,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract/cluster-node';

import { config } from '@/config';
import { useBoolean, useStepper } from '@/hooks';
import { HEADER } from '@/layouts/config-layout';

import { useOwnerInfo } from '@/components/global-config-init';

// const CircleBox = styled(Box)(({ theme }) => ({
//   width: 24,
//   height: 24,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   borderRadius: '50%',
//   backgroundColor: theme.palette.primary.main,
//   color: 'white',
// }));

// const yesIcon = <Iconify color="#21D7B5" textAlign="center" icon="healthicons:yes" />;

// const SetupItem = ({
//   title,
//   description,
//   checked,
//   onClick,
//   index,
//   divider = true,
//   buttonText = 'check',
//   loading = false,
//   disabled = false,
// }: {
//   loading?: boolean;
//   index: string;
//   title: string;
//   description?: React.ReactNode;
//   checked: boolean;
//   onClick: () => void;
//   divider?: boolean;
//   buttonText?: string;
//   disabled?: boolean;
// }) => {
//   return (
//     <>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
//         <Stack direction="row" spacing={2}>
//           <CircleBox>{index}</CircleBox>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <Typography variant="body1">{title}</Typography>
//             {checked && yesIcon}
//           </Stack>
//         </Stack>
//         <LoadingButton
//           loading={loading}
//           variant="contained"
//           size="small"
//           onClick={onClick}
//           sx={{
//             textTransform: 'capitalize',
//             minWidth: 80,
//           }}
//           disabled={disabled}
//         >
//           {buttonText}
//         </LoadingButton>
//       </Stack>
//       {description}
//       {divider && <Divider />}
//     </>
//   );
// };

export default function SetUpView() {
  const router = useRouter();

  const serviceCheckLoading = useBoolean();

  const registerClusterNodeLoading = useBoolean();

  const { getClusterNode, registerClusterNode } = useClusterNode();

  const [clusterNode, setClusterNode] = useState<Awaited<ReturnType<typeof getClusterNode>>>();

  // const [initiatorStatus, setInitiatorStatus] = useState<IResponseInitiatorStatus>();

  const { enqueueSnackbar } = useSnackbar();

  const { ownerInfo } = useOwnerInfo();

  // const serviceOk = useBoolean(false);

  const stepper = useStepper();

  // const getInitiatorStatus = async () => {
  //   try {
  //     // setServiceErrorText('');

  //     const result = await services.clusterNode.getInitiatorStatus();
  //     setInitiatorStatus(result);
  //     serviceOk.onTrue();
  //     return result;
  //   } catch (error) {
  //     if (error?.data?.code === 1001) {
  //       enqueueSnackbar(
  //         `Please set cluster node service first. Error Message: ${error.data.message}`,
  //         { variant: 'error' }
  //       );
  //     }

  //     if (error instanceof AxiosError) {
  //       if (error?.status && error?.status >= 400 && error?.status < 599) {
  //         enqueueSnackbar(`Server error: ${error.status}, please set cluster node service first.`, {
  //           variant: 'error',
  //         });
  //       }
  //     }
  //     serviceOk.onFalse();
  //     console.error('Error fetching cluster node:', error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    fetchClusterNode(false);
  }, []);

  const fetchClusterNode = async (goNext: boolean = true) => {
    const { pubkey } = ownerInfo;
    try {
      serviceCheckLoading.onTrue();

      // const result = await getInitiatorStatus();

      const node = await getClusterNode(pubkey!);
      setClusterNode(node);

      if (goNext) {
        stepper.handleNext();
      }
    } catch (error) {
      if (error?.data?.code === 1001) {
        enqueueSnackbar(
          `Please set cluster node service first. Error Message: ${error.data.message}`,
          { variant: 'error' }
        );
        return;
      }

      if (error instanceof AxiosError) {
        if (error?.status && error?.status >= 400 && error?.status < 599) {
          enqueueSnackbar(`Server error: ${error.status}, please set cluster node service first.`, {
            variant: 'error',
          });
        }
      }
      console.error('Error fetching cluster node:', error);
    } finally {
      serviceCheckLoading.onFalse();
    }
  };

  const registerClusterNodeClick = async () => {
    const { pubkey } = ownerInfo;

    if (!pubkey) {
      enqueueSnackbar('Please sign message first', { variant: 'error' });
      return;
    }

    try {
      registerClusterNodeLoading.onTrue();
      if (!clusterNode?.isRegistered) {
        await registerClusterNode(pubkey!);
      }

      // if (!initiatorStatus?.owner) {
      //   await bindInitiatorOwner();
      //   return;
      // }

      await fetchClusterNode();
    } catch (error) {
      enqueueSnackbar('Register cluster node failed', { variant: 'error' });
      console.error('Error registering cluster node:', error);
    } finally {
      registerClusterNodeLoading.onFalse();
    }
  };

  // const bindInitiatorOwner = async () => {
  //   if (initiatorStatus?.owner) {
  //     enqueueSnackbar(`Initiator already have owner, address: ${initiatorStatus?.owner}`, {
  //       variant: 'warning',
  //     });
  //     return;
  //   }

  //   if (initiatorStatus?.status !== 'Ready') {
  //     enqueueSnackbar(
  //       `Please wait for initiator status to be ready, status: ${initiatorStatus?.status}`,
  //       {
  //         variant: 'warning',
  //       }
  //     );
  //     await fetchClusterNode(false);
  //     return;
  //   }

  //   try {
  //     await services.clusterNode.bindInitiatorOwner(address!);
  //     enqueueSnackbar('Bind initiator owner success', { variant: 'success' });
  //     await fetchClusterNode();
  //   } catch (error) {
  //     console.error('Error binding initiator owner:', error);
  //   }
  // };

  const goToSelectOperators = () => {
    // if (!initiatorStatus?.owner) {
    //   enqueueSnackbar('Please bind your initiator owner first', { variant: 'warning' });
    //   return;
    // }

    // if (initiatorStatus?.owner !== address) {
    //   enqueueSnackbar(
    //     `You are not the owner of the initiator, owner address: ${initiatorStatus?.owner}`,
    //     {
    //       variant: 'warning',
    //     }
    //   );
    //   return;
    // }

    // if (initiatorStatus?.status !== IResponseInitiatorStatusEnum.completed) {
    //   enqueueSnackbar(
    //     `Please wait for initiator status to be completed, status: ${initiatorStatus?.status}`,
    //     {
    //       variant: 'warning',
    //     }
    //   );
    //   return;
    // }

    router.push(config.routes.validator.selectOperators);
  };

  // if (loading.value) {
  //   return (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //       }}
  //     >
  //       <LoadingScreen />
  //     </Box>
  //   );
  // }

  return (
    <Container
      maxWidth="md"
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

      <Box maxWidth={660}>
        <Typography variant="h3" pt={10} textAlign="left">
          <Typography display="inline" variant="inherit" color="primary.main">
            Cluster Node
          </Typography>
          &nbsp;Setup Instructions
        </Typography>

        <Typography variant="body1" pt={2} pb={4}>
          Everything you need to prepare before becoming a cluster node.
        </Typography>

        <Card sx={{ p: 3, py: 4, minWidth: 660 }}>
          <Stepper activeStep={stepper.activeStep} orientation="vertical">
            {/* <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  Service Status Check
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography>Check your service is available</Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={serviceCheckLoading.value}
                    onClick={() => {
                      fetchClusterNode();
                    }}
                  >
                    Continue
                  </LoadingButton>
                </Stack>
              </StepContent>
            </Step> */}

            <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  Register Node
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography maxWidth={600}>
                  {/* Register cluster node into contract and bind your initiator owner with address */}
                  Register your public key into cluster node contract
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <LoadingButton
                    variant="contained"
                    onClick={registerClusterNodeClick}
                    loading={registerClusterNodeLoading.value}
                  >
                    Continue
                  </LoadingButton>
                  {/* <Button onClick={stepper.handleBack} variant="outlined">
                    Back
                  </Button> */}
                </Stack>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  Select Operators
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography>Select operators to generate deposit data</Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <LoadingButton
                    variant="contained"
                    onClick={() => {
                      goToSelectOperators();
                    }}
                  >
                    Finish
                  </LoadingButton>

                  <Button onClick={stepper.handleBack} variant="outlined">
                    Back
                  </Button>
                </Stack>
              </StepContent>
            </Step>
          </Stepper>

          {/* {false && (
            <Stack direction="column" spacing={2}>
              <SetupItem
                index="1"
                title="Check your service is available"
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
                checked={
                  initiatorStatus?.status === IResponseInitiatorStatusEnum.completed &&
                  initiatorStatus?.owner === address
                }
                onClick={goToSelectOperators}
                buttonText="run"
                divider={false}
              />
            </Stack>
          )} */}
        </Card>
      </Box>
    </Container>
  );
}
