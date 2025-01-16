import { Helmet } from 'react-helmet-async';
import { enqueueSnackbar } from 'notistack';

import { Grid, Stack, Container, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useIsAccountRegisteredOperator } from '@/hooks/contract';

import { config } from '@/config';
import { useSelectedOperators } from '@/stores';

import Iconify from '@/components/iconify';
import { CardButton, CommonCard, CommonBack } from '@/components/common';

export default function ValidatorHomePage() {
  const result = useIsAccountRegisteredOperator();
  const router = useRouter();

  const { resetAll } = useSelectedOperators();

  return (
    <>
      <Helmet>
        <title> ValidatorHomePage</title>
      </Helmet>

      <Container>
        <CommonBack />
        <Typography variant="h2" py={6} textAlign="center">
          Run
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Validator
          </Typography>
          with <br />
          the SafeStake Network
        </Typography>
        <Grid container spacing={2} py={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <CommonCard
              title="Any validator can run on the SafeStake network: create a new validator."
              type="validator"
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <CardButton
                  text="Create new"
                  width={210}
                  onClick={() => router.push(config.routes.validator.create)}
                />
                <Iconify width={42} height={42} icon="fluent-mdl2:add-to" color="white" />
              </Stack>
            </CommonCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <CommonCard title="Or import your existing one to begin." type="validator">
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <CardButton
                  // isLoading={result.isRefetching}
                  isLoading={result.isLoading}
                  text="Import existing"
                  width={210}
                  onClick={async () => {
                    // const { data } = await result.refetch();
                    // const isAddressUsedByOperator = data;
                    const isAddressUsedByOperator = result.data;

                    if (isAddressUsedByOperator) {
                      enqueueSnackbar(
                        'You have already registered operator, you cannot register validator',
                        {
                          variant: 'error',
                        }
                      );
                    } else {
                      resetAll();
                      router.push(config.routes.validator.email);
                    }
                  }}
                />
                <Iconify
                  width={42}
                  height={42}
                  icon="fluent:arrow-up-circle-16-regular"
                  color="white"
                />
              </Stack>
            </CommonCard>
          </Grid>
          {false && (
            <Grid item xs={12} md={4}>
              <CommonCard title="Become to Initiator" type="validator">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <CardButton text="Become" width={210} />
                  <Iconify width={42} height={42} icon="fluent-mdl2:add-to" color="white" />
                </Stack>
              </CommonCard>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
