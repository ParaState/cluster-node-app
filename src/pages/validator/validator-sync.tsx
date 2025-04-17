import { useEffect } from 'react';

import Stack from '@mui/material/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Card, Button, Container, Typography, CircularProgress } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useRegisterValidator } from '@/hooks/contract';

import { delay } from '@/utils';
import { config } from '@/config';
import services from '@/services';
import { useBoolean } from '@/hooks';
import { useSelectedValidator } from '@/stores';
import { IRequestValidatorActionEnum } from '@/types';

import { CommonBack } from '@/components/common';
import { enqueueSnackbar } from '@/components/snackbar';

export default function ValidatorSyncPage() {
  const router = useRouter();

  const { selectedValidator } = useSelectedValidator();

  const loading = useBoolean(true);

  const { filterValidatorIsRegistered } = useRegisterValidator();

  useEffect(() => {
    handleSyncValidators();
  }, []);

  const handleSyncValidators = async () => {
    try {
      loading.onTrue();
      const { registered, notRegistered } = await filterValidatorIsRegistered(selectedValidator);
      console.log('🚀 ~ handleRunValidator ~ registered:', registered);
      console.log('🚀 ~ handleRunValidator ~ notRegistered:', notRegistered);

      if (registered.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          registered.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.register,
            txid: v.register_txid || '',
          }))
        );
        await delay(1000);
      }

      if (notRegistered.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          notRegistered.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.ready,
            txid: v.generate_txid || '',
          }))
        );
        await delay(1000);
      }

      const results = await services.beaconcha.getValidatorsByGroup([
        ...selectedValidator.map((v) => v.pubkey),
      ]);

      const { canDepositValidator, canExitValidator, isExitedValidator } = results;
      console.log('🚀 ~ handleSyncValidators ~ canDepositValidator:', canDepositValidator);
      console.log('🚀 ~ handleSyncValidators ~ canExitValidator:', canExitValidator);
      console.log('🚀 ~ handleSyncValidators ~ isExitedValidator:', isExitedValidator);

      const canDepositValidators = selectedValidator.filter((v) =>
        canDepositValidator.get(v.pubkey)
      );
      console.log('🚀 ~ handleSyncValidators ~ canDepositValidators:', canDepositValidators);
      const canExitValidators = selectedValidator.filter((v) => canExitValidator.get(v.pubkey));
      const isExitedValidators = selectedValidator.filter((v) => isExitedValidator.get(v.pubkey));

      if (canExitValidators.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          canExitValidators.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.deposit,
            txid: v.deposit_txid || '',
          }))
        );

        await delay(1000);
      }

      if (isExitedValidators.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          isExitedValidators.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.exit,
            txid: v.exit_txid || '',
          }))
        );

        await delay(1000);
      }

      // if (canDepositValidators.length <= 0) {
      //   return;
      // }

      // router.push(config.routes.validator.home);
    } catch (error) {
      enqueueSnackbar('Failed to sync validators', { variant: 'error' });
      console.error(error);
    } finally {
      loading.onFalse();
    }
  };

  return (
    <Container maxWidth="md">
      <CommonBack />

      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h2" textAlign="center">
          Sync
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Validators
          </Typography>
          Status
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          {loading.value ? (
            <Stack alignItems="center" spacing={4}>
              <CircularProgress variant="indeterminate" color="primary" size={100} />
              <Typography variant="body1" color="text.secondary">
                Syncing {selectedValidator.length} validators
              </Typography>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={3}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h6" color="success.main">
                All validators synced successfully!
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.replace(config.routes.clusterValidator.home)}
              >
                Go to Validators
              </Button>
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
