import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Step,
  Alert,
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
  useTokenBalance,
  ClusterNodeActionFee,
  useTokenApprovalWithAddress,
} from '@/hooks/contract';

import { formatEtherFixed } from '@/utils/format';

import { config } from '@/config';
import services from '@/services';
import { useGenerateValidatorInfo } from '@/stores';

import { enqueueSnackbar } from '@/components/snackbar';
import { LoadingScreen } from '@/components/loading-screen';
import { useGlobalConfig } from '@/components/global-config-init';
import { CommonBack, ImportWalletToken } from '@/components/common';

export default function ValidatorGenerateConfirmPage() {
  const router = useRouter();

  const generateLoading = useBoolean();

  const { generateValidatorInfo } = useGenerateValidatorInfo();

  const { generateDepositData } = useClusterNode();

  const { approveAllowance } = useTokenApprovalWithAddress(config.contractAddress.clusterNode);

  const { getActionFee } = useClusterNode();

  const { tokenInfo } = useGlobalConfig();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isApproveLoading = useBoolean();
  const isApproved = useBoolean(false);
  const approveButtonText = isApproved.value ? 'Approved' : `Approve ${tokenInfo.symbol}`;

  const { balance } = useTokenBalance();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApproveClick = async () => {
    isApproveLoading.onTrue();
    try {
      const approveResult = await approveAllowance(currentFee);

      if (!approveResult.isTokenEnough) {
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
        generateValidatorInfo.validatorCount,
        generateValidatorInfo.operatorIds,
        parseEther('32'),
        generateValidatorInfo.withdrawalAddress as `0x${string}`
      );

      router.push(config.routes.validator.getValidatorPollingTx(receipt?.transactionHash));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.shortMessage || 'Failed to generate validators', { variant: 'error' });
    } finally {
      generateLoading.onFalse();
    }
  };

  if (loading.value) {
    return <LoadingScreen />;
  }

  const steps = [
    {
      label: `Approve DVT`,
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step1" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              Total Validators: {generateValidatorInfo.validatorCount}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" width={1}>
              <Typography variant="body1">
                Total fee <ImportWalletToken />
              </Typography>
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
