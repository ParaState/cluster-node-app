import { useState } from 'react';
import { useAccount } from 'wagmi';

import { Grid, Container, Typography } from '@mui/material';

import { useClusterValidator } from '@/hooks/api';

import { defaultPagination, IRequestCommonPagination } from '@/types';

import { ClusterValidatorTable } from '@/sections/my-account';

const MyAccountTitle = () => (
  <Typography variant="h2" align="center">
    My Account
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

  // if (isValidatorEmpty) {
  //   return (
  //     <Container
  //       maxWidth="xl"
  //       sx={{
  //         my: 4,
  //         textAlign: 'center',
  //       }}
  //     >
  //       <MyAccountTitle />
  //       <Typography
  //         variant="body1"
  //         fontWeight={500}
  //         align="center"
  //         my={4}
  //         fontSize={24}
  //         color={theme.palette.grey[600]}
  //       >
  //         Your account has not been registered as a validator or operator.
  //       </Typography>

  //       <LoadingButton
  //         color="primary"
  //         variant="soft"
  //         sx={{
  //           borderRadius: 4,
  //           width: 300,
  //           my: 4,
  //         }}
  //         size="large"
  //         onClick={() => {
  //           router.push(config.routes.home);
  //         }}
  //       >
  //         Join The SafeStake Network
  //       </LoadingButton>
  //     </Container>
  //   );
  // }

  return (
    <Container
      maxWidth="xl"
      sx={{
        my: 4,
      }}
    >
      <MyAccountTitle />

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
          {/* {false && (
            <OwnedValidatorTable
              address={address!}
              validatorQuery={validatorQuery}
              pagination={validatorPagination}
              setPagination={setValidatorPagination}
              onPaginationChange={(pagination) => {
                setValidatorPagination(pagination);
              }}
            />
          )} */}

          <ClusterValidatorTable
            address={address!}
            clusterValidatorQuery={clusterValidatorQuery}
            pagination={clusterValidatorPagination}
            setPagination={setClusterValidatorPagination}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
