import { useAccount } from 'wagmi';
import React, { useState } from 'react';

import { Grid, Container, Typography } from '@mui/material';

import { useClusterValidator } from '@/hooks/api';

import { defaultPagination, IRequestCommonPagination } from '@/types';

import FabWithGuide from '@/components/FabWithGuide';

import { ClusterValidatorTable } from '@/sections/my-account';

const ClusterValidatorTitle = () => (
  <Typography variant="h2" align="center">
    Cluster Validators
  </Typography>
);

export default function MyAccountPage() {
  // const router = useRouter();

  // const [validatorPagination, setValidatorPagination] =
  //   useState<IRequestCommonPagination>(defaultPagination);

  const [clusterValidatorPagination, setClusterValidatorPagination] =
    useState<IRequestCommonPagination>(defaultPagination);

  const { address } = useAccount();

  // const { validatorQuery, isValidatorEmpty } = useOwnedValidator(address!, validatorPagination);

  const { clusterValidatorQuery } = useClusterValidator();

  // const theme = useTheme();

  return (
    <Container
      maxWidth="xl"
      sx={{
        my: 4,
      }}
    >
      <ClusterValidatorTitle />

      <Grid container mt={2} spacing={2}>
        {/* <Grid item xs={12} md={3}>
          <BlockHeightCard />
        </Grid> */}

        {/* <Grid item xs={12} md={3}>
          <TokenBalanceCard address={address!} />
        </Grid> */}
      </Grid>

      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} md={12}>
          <ClusterValidatorTable
            address={address!}
            clusterValidatorQuery={clusterValidatorQuery}
            pagination={clusterValidatorPagination}
            setPagination={setClusterValidatorPagination}
          />
        </Grid>
      </Grid>

      <FabWithGuide />
    </Container>
  );
}
