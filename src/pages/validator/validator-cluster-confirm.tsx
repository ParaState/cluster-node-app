import { useWatchAsset } from 'wagmi';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

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

import { useParams, useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';
import { useTokenBalance, useRegisterValidator } from '@/hooks/contract';
import { useTokenApproval } from '@/hooks/contract/token/use-token-approval';

import { formatEtherFixed } from '@/utils/format';

import { config } from '@/config';
import services from '@/services';
import {
  CurrentFeeMode,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

import Iconify from '@/components/iconify';
import { CommonBack } from '@/components/common';
import { ValidatorBeachonLink } from '@/components/validator';
import { useGlobalConfig } from '@/components/global-config-init';
import ValidatorFeeToggleButton from '@/components/validator/validator-fee-toggle-button';

const batchSize = 20;

export default function ValidatorClusterConfirmPage() {
  const router = useRouter();
  const { txid } = useParams();

  const { watchAsset } = useWatchAsset();

  const [clusterNodeValidators, setClusterNodeValidators] = useState<
    IResponseClusterNodeValidatorItem[]
  >([]);

  const clusterNodeValidatorsGrouped = Array.from(
    { length: Math.ceil(clusterNodeValidators.length / batchSize) },
    (_, i) => clusterNodeValidators.slice(i * batchSize, (i + 1) * batchSize)
  );

  const [successIndex, setSuccessIndex] = useState<number[]>([]);

  const [publicKeyOpens, setPublicKeyOpens] = useState<boolean[]>(
    clusterNodeValidatorsGrouped.map(() => false)
  );

  const [currentFeeMode, setCurrentFeeMode] = useState<CurrentFeeMode>(CurrentFeeMode.month);

  const { tokenInfo, getSubscriptionFeeFeeByFeeMode } = useGlobalConfig();

  const isApproveLoading = useBoolean();
  const isApproved = useBoolean(false);
  const approveButtonText = isApproved.value ? 'Approved' : `Approve ${tokenInfo.symbol}`;

  const [runningValidatorIndex, setRunningValidatorIndex] = useState<number | null>(null);
  const { approveAllowance } = useTokenApproval();

  const { balance } = useTokenBalance();

  const currentFee = getSubscriptionFeeFeeByFeeMode(currentFeeMode, clusterNodeValidators.length);

  const { registerClusterNodeValidator, registerClusterNodeValidatorEstimation } =
    useRegisterValidator();

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

  const fetchValidators = useCallback(async () => {
    const res = await services.clusterNode.queryValidatorStatus(
      IResponseValidatorStatusEnum.all,
      IResponseValidatorStatusEnum.all,
      txid!
    );
    setClusterNodeValidators(res);
  }, [txid]);

  useEffect(() => {
    if (!txid) return;
    fetchValidators();
  }, [fetchValidators, txid]);

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

    const validator = clusterNodeValidatorsGrouped[index].filter((v) => v.deposit_data);
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
      await registerClusterNodeValidator(validator, currentFee);
      setSuccessIndex((prev) => [...prev, index]);
    } catch (error) {
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      setRunningValidatorIndex(null);
    }
  };

  const steps = [
    {
      label: `Approve DVT`,
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              Total Validators: {clusterNodeValidators.length}
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
              You Have {clusterNodeValidators.length} Validators, Validator Public Keys:
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
                  router.replace(config.routes.validator.success);
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
