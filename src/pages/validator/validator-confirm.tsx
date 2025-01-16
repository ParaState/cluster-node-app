import { useWatchAsset } from 'wagmi';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

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
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';
import { useTokenBalance, useRegisterValidator } from '@/hooks/contract';
import { useTokenApproval } from '@/hooks/contract/token/use-token-approval';

import { formatEtherFixed } from '@/utils/format';

import { config } from '@/config';
import { CurrentFeeMode } from '@/types';
import { useSelectedOperators } from '@/stores';

import { CommonBack } from '@/components/common';
import { ValidatorBeachonLink } from '@/components/validator';
import { useGlobalConfig } from '@/components/global-config-init';
import { OperatorInfoContainer } from '@/components/operator/operator-info';
import ValidatorFeeToggleButton from '@/components/validator/validator-fee-toggle-button';

export default function ValidatorConfirmPage() {
  const router = useRouter();

  const { watchAsset } = useWatchAsset();

  const { keyStorePrivateKeys, keyStorePublicKeys, selectedOperators } = useSelectedOperators();

  const [currentFeeMode, setCurrentFeeMode] = useState<CurrentFeeMode>(CurrentFeeMode.month);

  const { tokenInfo, getSubscriptionFeeFeeByFeeMode } = useGlobalConfig();

  const [activeStep, setActiveStep] = useState(0);

  const isApproveLoading = useBoolean();
  const isApproved = useBoolean(false);
  const approveButtonText = isApproved.value ? 'Approved' : `Approve ${tokenInfo.symbol}`;

  const isRunValidatorLoading = useBoolean();

  const { approveAllowance } = useTokenApproval();

  const { balance } = useTokenBalance();

  const currentFee = getSubscriptionFeeFeeByFeeMode(currentFeeMode, keyStorePrivateKeys.length);

  const { registerValidator, registerValidatorEstimation, createRegisterValidatorParams } =
    useRegisterValidator();

  useEffect(() => {
    setActiveStep(0);
    isApproved.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFeeMode]);

  // TODO use useWalletClient
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

  const onRunValidatorClick = async () => {
    isRunValidatorLoading.onTrue();

    const params = await createRegisterValidatorParams(currentFeeMode);
    console.log('🚀 ~ onRunValidatorClick ~ params:', params);

    const estimationError = await registerValidatorEstimation(params);
    console.log('🚀 ~ onRunValidatorClick ~ estimationError:', estimationError);

    if (estimationError) {
      enqueueSnackbar(estimationError?.details || estimationError?.message, { variant: 'error' });
      isRunValidatorLoading.onFalse();
      return;
    }

    try {
      await registerValidator(params);
      router.replace(config.routes.validator.success);
    } catch (error) {
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      isRunValidatorLoading.onFalse();
    }
  };

  return (
    <Container maxWidth="md">
      <CommonBack />
      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h2" textAlign="center">
          Confirm
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Operators
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          <Typography variant="body1" mb={2}>
            Validator Public Keys
          </Typography>

          <Box
            sx={{
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {keyStorePublicKeys.map((pk, index) => (
              <ValidatorBeachonLink pk={pk} key={index} />
            ))}
          </Box>

          <Typography variant="body1" mb={2}>
            Selected Operators
          </Typography>

          <Stack direction="column" alignItems="start">
            {selectedOperators.map((operator, index) => (
              <OperatorInfoContainer operator={operator} key={index} />
            ))}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
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

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
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

          <Stack direction="row" spacing={2} mb={2}>
            <LoadingButton
              fullWidth
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

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="soft"
              loading={isRunValidatorLoading.value}
              onClick={() => {
                if (!isApproved.value) return;

                onRunValidatorClick();
              }}
            >
              Run Validator
            </LoadingButton>
          </Stack>

          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} sx={{ width: '60%', margin: 'auto' }}>
              {['1', '2'].map((label, index) => {
                return (
                  <Step key={label}>
                    <StepLabel />
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
