import { useWatchAsset } from 'wagmi';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Step,
  Alert,
  Button,
  Stepper,
  Collapse,
  Container,
  StepLabel,
  Typography,
  CardHeader,
  IconButton,
  StepContent,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';
import { useTokenBalance, useRegisterValidator } from '@/hooks/contract';
import { useTokenApproval } from '@/hooks/contract/token/use-token-approval';

import { formatEtherFixed } from '@/utils/format';

import { config } from '@/config';
import services from '@/services';
import { useSelectedValidator } from '@/stores';
import { CurrentFeeMode, IRequestValidatorActionEnum } from '@/types';

import Iconify from '@/components/iconify';
import { CommonBack } from '@/components/common';
import { useGlobalConfig } from '@/components/global-config-init';
import { ValidatorBeachonLink, ValidatorFeeToggleButton } from '@/components/validator';

const batchSize = 20;

export default function ValidatorClusterConfirmPage() {
  const router = useRouter();

  const { watchAsset } = useWatchAsset();

  const { selectedValidator } = useSelectedValidator();

  const clusterNodeValidatorsGrouped = Array.from(
    { length: Math.ceil(selectedValidator.length / batchSize) },
    (_, i) => selectedValidator.slice(i * batchSize, (i + 1) * batchSize)
  );

  const [successIndex, setSuccessIndex] = useState<number[]>([]);

  const [publicKeyOpens, setPublicKeyOpens] = useState<boolean[]>(
    clusterNodeValidatorsGrouped.map(() => false)
  );

  const [currentFeeMode, setCurrentFeeMode] = useState<CurrentFeeMode>(CurrentFeeMode.month);

  const { tokenInfo, getSubscriptionFeeFeeByFeeMode } = useGlobalConfig();

  const isApproveLoading = useBoolean();
  const isApproved = useBoolean(false);
  // const isCheckValidatorRegisteredLoading = useBoolean();
  const approveButtonText = isApproved.value ? 'Approved' : `Approve ${tokenInfo.symbol}`;

  const [runningValidatorIndex, setRunningValidatorIndex] = useState<number | null>(null);
  const { approveAllowance } = useTokenApproval();

  const { balance } = useTokenBalance();

  const currentFee = getSubscriptionFeeFeeByFeeMode(currentFeeMode, selectedValidator.length);

  const {
    registerClusterNodeValidator,
    registerClusterNodeValidatorEstimation,
    // checkValidatorIsRegistered,
  } = useRegisterValidator();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const setPublicKeyOpenByIndex = (index: number) => {
    setPublicKeyOpens((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });
  };

  useEffect(() => {
    setActiveStep(0);
    isApproved.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFeeMode]);

  const importTokenToWallet = () => {
    const options = {
      address: config.contractAddress.token,
      decimals: tokenInfo.decimals,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
    };
    watchAsset({
      type: 'ERC20',
      options,
    });
  };

  const onApproveClick = async () => {
    isApproveLoading.onTrue();
    try {
      const result = await approveAllowance(currentFee);
      if (result.isTokenEnough) {
        setActiveStep(1);
        isApproved.onTrue();
      } else {
        enqueueSnackbar('Insufficient balance', { variant: 'error' });
      }
    } finally {
      isApproveLoading.onFalse();
    }
  };

  const onRunValidatorClick = async (index: number) => {
    setRunningValidatorIndex(index);

    const currentGroupValidators = clusterNodeValidatorsGrouped[index];

    const validator = currentGroupValidators.filter((v) => v.deposit_data);
    console.log('🚀 ~ onRunValidatorClick ~ validator:', validator);

    // setRunningValidatorIndex(index);

    const estimationError = await registerClusterNodeValidatorEstimation(validator, currentFee);
    console.log('🚀 ~ onRunValidatorClick ~ estimationError:', estimationError);
    if (estimationError) {
      enqueueSnackbar(estimationError?.details || estimationError?.message, {
        variant: 'error',
      });
      setRunningValidatorIndex(null);
    }

    try {
      const txid = await registerClusterNodeValidator(validator, currentFee);

      const body = validator.map((v) => ({
        pubkey: v.pubkey,
        action: IRequestValidatorActionEnum.register,
        txid,
      }));

      await services.clusterNode.updateValidatorStatus(body);

      setSuccessIndex((prev) => [...prev, index]);
    } catch (error) {
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      setRunningValidatorIndex(null);
    }
  };

  // const handleCheckValidatorRegistered = async () => {
  //   try {
  //     isCheckValidatorRegisteredLoading.onTrue();
  //     const result = await checkValidatorIsRegistered(selectedValidator.map((v) => v.pubkey));
  //     // const result = await checkValidatorIsRegistered([
  //     //   '0xa99408b47d515a1ea093489d5f36bba4ca7c60f16b7d2642eee16c1aa3ce8f0c67931cec1975c61d224e810fc077a723',
  //     //   '0x87a470542a099a29301880ee63fd017ef553fdec987c6ba9a5de946a6185b08a1271147a81777158c6b2e0f3443af1fd',
  //     // ]);
  //     console.log('🚀 ~ handleCheckValidatorRegistered ~ result:', result);
  //     if (result) {
  //       enqueueSnackbar('Some of validators are registered to network contract', {
  //         variant: 'error',
  //       });

  //       return;
  //     }

  //     handleNext();
  //   } finally {
  //     isCheckValidatorRegisteredLoading.onFalse();
  //   }
  // };

  const steps = [
    // {
    //   label: 'Check Validator Registration',
    //   render: () => {
    //     return (
    //       <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
    //         <Typography variant="body1" mb={2}>
    //           Checking if validators are registered to network contract
    //         </Typography>

    //         <Stack direction="row" width={1}>
    //           <LoadingButton
    //             sx={{ width: 300 }}
    //             color="primary"
    //             size="large"
    //             type="submit"
    //             variant="soft"
    //             loading={isCheckValidatorRegisteredLoading.value}
    //             onClick={() => {
    //               handleCheckValidatorRegistered();
    //             }}
    //           >
    //             Check Validators
    //           </LoadingButton>
    //         </Stack>
    //       </Stack>
    //     );
    //   },
    // },
    {
      label: `Approve DVT`,
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              Total Validators: {selectedValidator.length}
            </Typography>

            {/* <Stack direction="column" alignItems="start">
              {selectedOperators.map((operator, index) => (
                <OperatorInfoContainer operator={operator} key={index} />
              ))}
            </Stack> */}

            <Stack direction="row" alignItems="center" justifyContent="space-between" width={1}>
              <Typography variant="body1">
                Total fee{' '}
                <Link
                  underline="always"
                  display="inline"
                  onClick={importTokenToWallet}
                  sx={{ cursor: 'pointer' }}
                >
                  (Import {tokenInfo.symbol} Token)
                </Link>
              </Typography>

              <ValidatorFeeToggleButton
                onChange={(v) => {
                  setCurrentFeeMode(v);
                }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
              width={1}
            >
              <Typography variant="body1" color="text.primary">
                ≈ {formatEtherFixed(currentFee)}
              </Typography>
              <Typography variant="body1">
                {tokenInfo.symbol}/per {currentFeeMode}
              </Typography>
            </Stack>

            {balance <= 0 && (
              <Box py={2}>
                <Alert severity="info" variant="outlined">
                  <Typography fontSize={18}>
                    Need more DVT? Go to{' '}
                    <Typography
                      color="primary.main"
                      component={Link}
                      underline="always"
                      href={config.links.uniswapLink}
                      target="_blank"
                      fontWeight={600}
                    >
                      Uniswap
                    </Typography>{' '}
                    to gain more DVT.
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* <Stack direction="row" alignItems="center" justifyContent="center" width={1}> */}
            <Stack direction="row" width={1}>
              <LoadingButton
                sx={{ width: 300 }}
                color="primary"
                size="large"
                type="submit"
                variant="soft"
                loading={isApproveLoading.value}
                disableRipple
                onClick={() => {
                  if (isApproved.value) return;
                  onApproveClick();
                }}
              >
                {approveButtonText}
              </LoadingButton>
            </Stack>
          </Stack>
        );
      },
    },
    {
      label: 'Run Your Validators',
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step2" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              You Have {selectedValidator.length} Validators, Validator Public Keys:
            </Typography>

            <Box
              sx={{
                maxWidth: 1,
                overflowY: 'auto',
              }}
            >
              {clusterNodeValidatorsGrouped.map((pks, index) => {
                const open = publicKeyOpens[index];

                return (
                  <Card sx={{ mb: 2 }} variant="outlined" key={index}>
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            color="inherit"
                            onClick={() => {
                              setPublicKeyOpenByIndex(index);
                            }}
                          >
                            <Iconify icon={open ? 'mingcute:up-fill' : 'mingcute:down-fill'} />
                          </IconButton>
                          <Typography variant="h6">
                            Validator #{index * batchSize + 1}-#{index * batchSize + pks.length}
                          </Typography>
                        </Stack>
                      }
                      color="text.primary"
                      sx={{ px: 2, py: 2 }}
                      action={
                        <LoadingButton
                          fullWidth
                          color="primary"
                          size="large"
                          type="submit"
                          variant="soft"
                          loading={runningValidatorIndex === index}
                          disabled={runningValidatorIndex !== null || successIndex.includes(index)}
                          onClick={() => {
                            if (!isApproved.value) return;

                            onRunValidatorClick(index);
                          }}
                        >
                          {successIndex.includes(index) ? 'Success' : 'Run Validators'}
                        </LoadingButton>
                      }
                    />

                    <Collapse in={open}>
                      {pks.map((pk, jIndex) => (
                        <ValidatorBeachonLink pk={pk.pubkey} key={jIndex} />
                      ))}
                    </Collapse>
                  </Card>
                );
              })}
            </Box>

            <Stack direction="row" width={1} justifyContent="center">
              <LoadingButton
                sx={{ width: 300 }}
                color="primary"
                size="large"
                type="submit"
                variant="soft"
                disabled={successIndex.length !== clusterNodeValidatorsGrouped.length}
                disableRipple
                onClick={() => {
                  router.replace(config.routes.clusterValidator.home);
                }}
              >
                Finish
              </LoadingButton>
            </Stack>
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="md">
      <CommonBack />

      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h2" textAlign="center">
          Confirm
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Operators(Beta)
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" fontSize={20}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {/* <Typography>{step.description}</Typography> */}
                  {step.render()}
                  {false && (
                    <Box sx={{ mt: 3 }}>
                      <Button variant="contained" onClick={handleNext}>
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button disabled={index === 0} onClick={handleBack}>
                        Back
                      </Button>
                    </Box>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Stack>
    </Container>
  );
}
