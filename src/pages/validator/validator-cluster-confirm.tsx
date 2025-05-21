import { z } from 'zod';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Step,
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
import { useTokenApproval } from '@/hooks/contract/token/use-token-approval';
import { useFeeReceiptAddress, useRegisterValidator } from '@/hooks/contract';

import { config } from '@/config';
import services from '@/services';
import { isAddressZero } from '@/utils';
import { useSelectedValidator } from '@/stores';
import { CurrentFeeMode, IRequestValidatorActionEnum } from '@/types';

import Iconify from '@/components/iconify';
import { CommonBack } from '@/components/common';
import { useGlobalConfig } from '@/components/global-config-init';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import {
  NeedMoreDvtLink,
  ValidatorBeachonLink,
  ValidatorSubscriptionFee,
  ValidatorTotalFeeToggleButton,
} from '@/components/validator';

const batchSize = 20;

const schema = z.object({
  address: z.string().refine((value) => isAddress(value), {
    message: 'Address is invalid.',
  }),
});

type FormSchema = z.infer<typeof schema>;

export default function ValidatorClusterConfirmPage() {
  const { address } = useAccount();
  const { setFeeRecipientAddress, getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);
  const { selectedValidator, isLidoCSMWithdrawalAddress } = useSelectedValidator();

  const defaultValues = {
    address: getFeeRecipientAddressQuery.data || address,
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (getFeeRecipientAddressQuery.data) {
      if (isLidoCSMWithdrawalAddress()) {
        form.setValue('address', config.contractAddress.lidoFeeRecipient);
      } else {
        form.setValue(
          'address',
          isAddressZero(getFeeRecipientAddressQuery.data)
            ? address!
            : getFeeRecipientAddressQuery.data!
        );
      }
    }
  }, [getFeeRecipientAddressQuery.data]);

  const router = useRouter();

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

  // const { balance } = useTokenBalance();

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
    isApproved.onFalse();
  }, [currentFeeMode]);

  const onApproveClick = async () => {
    isApproveLoading.onTrue();
    try {
      const result = await approveAllowance(currentFee);
      if (result.isTokenEnough) {
        handleNext();
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
    // console.log('🚀 ~ onRunValidatorClick ~ validator:', validator);

    // setRunningValidatorIndex(index);

    const estimationError = await registerClusterNodeValidatorEstimation(validator, currentFee);
    // console.log('🚀 ~ onRunValidatorClick ~ estimationError:', estimationError);
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (formValue) => {
    try {
      if (formValue.address === getFeeRecipientAddressQuery.data) {
        handleNext();
        return;
      }
      await setFeeRecipientAddress(formValue.address);
      await getFeeRecipientAddressQuery.refetch();
      handleNext();
    } catch (error) {
      enqueueSnackbar(error.details || error.message, { variant: 'error' });
    }
  });

  return (
    <Container maxWidth="md">
      <CommonBack />

      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h2" textAlign="center">
          Run
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Validators
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  Set Fee Recipient Address
                </Typography>
              </StepLabel>
              <StepContent>
                <Stack direction="row" alignItems="center">
                  <Link
                    sx={{ cursor: 'pointer' }}
                    variant="body2"
                    underline="always"
                    onClick={() => {
                      form.setValue('address', config.contractAddress.lidoFeeRecipient);
                    }}
                  >
                    Fill Lido CSM fee recipient address
                  </Link>
                </Stack>
                <FormProvider methods={form} onSubmit={onSubmit}>
                  <RHFTextField
                    name="address"
                    type="text"
                    fullWidth
                    sx={{ my: 1 }}
                    placeholder="Enter fee recipient address"
                  />
                  <Stack direction="row" width={1}>
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={getFeeRecipientAddressQuery.isLoading || isSubmitting}
                    >
                      Continue
                    </LoadingButton>
                  </Stack>
                </FormProvider>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  {tokenInfo.isNativeToken
                    ? 'Confirm Subscription Fee'
                    : `Approve ${tokenInfo.symbol}`}
                </Typography>
              </StepLabel>
              <StepContent>
                <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
                  <Typography variant="body1" mb={2}>
                    Total Validators: {selectedValidator.length}
                  </Typography>

                  <ValidatorTotalFeeToggleButton
                    onChange={(v) => {
                      setCurrentFeeMode(v);
                    }}
                  />

                  <ValidatorSubscriptionFee
                    currentFeeMode={currentFeeMode}
                    currentFee={currentFee}
                  />

                  <NeedMoreDvtLink />

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
                        if (tokenInfo.isNativeToken) {
                          setActiveStep(1);
                          return;
                        }

                        if (isApproved.value) return;
                        onApproveClick();
                      }}
                    >
                      {tokenInfo.isNativeToken ? 'Next' : approveButtonText}
                    </LoadingButton>
                  </Stack>
                </Stack>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="h6" fontSize={20}>
                  Run Your Validators
                </Typography>
              </StepLabel>
              <StepContent>
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
                                  <Iconify
                                    icon={open ? 'mingcute:up-fill' : 'mingcute:down-fill'}
                                  />
                                </IconButton>
                                <Typography variant="h6">
                                  Validator #{index * batchSize + 1}-#
                                  {index * batchSize + pks.length}
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
                                disabled={
                                  runningValidatorIndex !== null || successIndex.includes(index)
                                }
                                onClick={() => {
                                  if (tokenInfo.isNativeToken) {
                                    onRunValidatorClick(index);
                                    return;
                                  }

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
                {false && (
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={handleNext}>
                      Finish
                    </Button>
                    <Button disabled={false} onClick={handleBack}>
                      Back
                    </Button>
                  </Box>
                )}
              </StepContent>
            </Step>
          </Stepper>
        </Card>
      </Stack>
    </Container>
  );
}
