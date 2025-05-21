import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Step,
  Stepper,
  Container,
  StepLabel,
  Typography,
  StepContent,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';
import {
  useClusterNode,
  ClusterNodeActionFee,
  useTokenApprovalWithAddress,
} from '@/hooks/contract';

import { formatEtherWithIntl } from '@/utils/format';

import { config } from '@/config';
import services from '@/services';
import { useGenerateValidatorInfo } from '@/stores';

import { CommonBack } from '@/components/common';
import { enqueueSnackbar } from '@/components/snackbar';
import { LoadingScreen } from '@/components/loading-screen';
import { useOwnerInfo, useGlobalConfig } from '@/components/global-config-init';

export default function ValidatorGenerateConfirmPage() {
  const router = useRouter();

  const { ownerInfo } = useOwnerInfo();

  const generateLoading = useBoolean();

  const { generateValidatorInfo } = useGenerateValidatorInfo();

  const { generateDepositData } = useClusterNode();

  const { getActionFee } = useClusterNode();

  const { clusterNodeFeeTokenInfo } = useGlobalConfig();

  const { approveToken, isLoading: isTokenLoading } = useTokenApprovalWithAddress(
    clusterNodeFeeTokenInfo.address,
    config.contractAddress.clusterNode
  );

  const [currentFee, setCurrentFee] = useState(0n);

  const loading = useBoolean();

  const getFee = async () => {
    try {
      loading.onTrue();
      const fee = await getActionFee(ClusterNodeActionFee.GENERATE_DEPOSIT_DATA);
      setCurrentFee(fee * BigInt(generateValidatorInfo.validatorCount));
    } finally {
      loading.onFalse();
    }
  };

  useEffect(() => {
    getFee();
  }, []);

  const isApproveLoading = useBoolean();
  const isApproved = useBoolean(false);
  const approveButtonText = isApproved.value
    ? 'Approved'
    : `Approve ${clusterNodeFeeTokenInfo.symbol}`;

  // const { balance } = useTokenBalance();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  useEffect(() => {
    setActiveStep(0);
    isApproved.onFalse();
  }, []);

  const onApproveClick = async () => {
    isApproveLoading.onTrue();
    try {
      const approveResult = await approveToken(currentFee);

      if (!approveResult.isTokenEnough || !approveResult.isBalanceEnough) {
        enqueueSnackbar('Insufficient balance', { variant: 'error' });
        return;
      }

      handleNext();
    } finally {
      isApproveLoading.onFalse();
    }
  };

  const onGenerateValidatorClick = async () => {
    try {
      generateLoading.onTrue();
      const result = await services.clusterNode.getInitiatorStatus();

      const receipt = await generateDepositData(
        result.cluster_pubkey,
        ownerInfo.owner,
        ownerInfo.pubkey,
        generateValidatorInfo.validatorCount,
        generateValidatorInfo.operatorIds,
        parseEther('32'),
        generateValidatorInfo.withdrawalAddress as `0x${string}`
      );

      router.push(config.routes.validator.getValidatorPollingTx(receipt?.transactionHash));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Failed to generate validators', { variant: 'error' });
    } finally {
      generateLoading.onFalse();
    }
  };

  if (loading.value || !clusterNodeFeeTokenInfo.address || isTokenLoading) {
    return <LoadingScreen />;
  }

  console.log(clusterNodeFeeTokenInfo);

  const steps = [
    {
      label: clusterNodeFeeTokenInfo.isNativeToken
        ? 'Confirm Subscription Fee'
        : `Approve ${clusterNodeFeeTokenInfo.symbol}`,
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              Total Validators: {generateValidatorInfo.validatorCount}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" width={1}>
              <Typography variant="body1">Total fee</Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
              width={1}
            >
              <Typography variant="body1" color="text.primary">
                ≈ {formatEtherWithIntl(currentFee)}
              </Typography>
            </Stack>

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
                  if (clusterNodeFeeTokenInfo.isNativeToken) {
                    setActiveStep(1);
                    return;
                  }

                  if (isApproved.value) return;
                  onApproveClick();
                }}
              >
                {clusterNodeFeeTokenInfo.isNativeToken ? 'Next' : approveButtonText}
              </LoadingButton>
            </Stack>
          </Stack>
        );
      },
    },
    {
      label: 'Generate Your Validators',
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step2" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              It will take a few minutes to generate your validators.
            </Typography>

            <Box
              sx={{
                maxWidth: 1,
                overflowY: 'auto',
              }}
            />

            <Stack direction="row" width={1} justifyContent="center">
              <LoadingButton
                sx={{ width: 300 }}
                color="primary"
                size="large"
                type="submit"
                variant="soft"
                disableRipple
                onClick={onGenerateValidatorClick}
                loading={generateLoading.value}
              >
                Generate Validators
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
          Generate
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
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" fontSize={20}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>{step.render()}</StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Stack>
    </Container>
  );
}
