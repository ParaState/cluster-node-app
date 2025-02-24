import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Card, Button, Container, Typography, CircularProgress } from '@mui/material';

import { useParams, useRouter } from '@/routes/hooks';

import services from '@/services';
import { config } from '@/config';
import { useGenerateValidatorInfo } from '@/stores';
import { IResponseClusterNodeValidatorItem } from '@/types';

import { CommonBack } from '@/components/common';

export default function ValidatorPollingTxPage() {
  const router = useRouter();

  const { txid } = useParams();

  const { generateValidatorInfo } = useGenerateValidatorInfo();

  const [clusterNodeValidators, setClusterNodeValidators] = useState<
    IResponseClusterNodeValidatorItem[]
  >([]);

  const fetchValidators = async () => {
    const res = await services.clusterNode.queryValidatorStatus({
      pubkey: '',
      status: '',
      generate_txid: txid!,
      register_txid: '',
      deposit_txid: '',
      exit_txid: '',
    });

    setClusterNodeValidators(res);

    return res;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!txid) return;

      const list = await fetchValidators();

      if (list.length === generateValidatorInfo.validatorCount) {
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [txid]);

  return (
    <Container maxWidth="md">
      <CommonBack />

      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h2" textAlign="center">
          Generating
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Validators
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          {clusterNodeValidators.length < generateValidatorInfo.validatorCount ? (
            <Stack alignItems="center" spacing={4}>
              <CircularProgress variant="indeterminate" color="primary" size={100} />
              <Typography variant="body1" color="text.secondary">
                Generating validators ({clusterNodeValidators.length} /{' '}
                {generateValidatorInfo.validatorCount})
              </Typography>
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={2}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h6" color="success.main">
                All validators generated successfully!
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(config.routes.clusterValidator.home)}
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
