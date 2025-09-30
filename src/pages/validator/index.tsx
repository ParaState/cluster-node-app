import { Helmet } from 'react-helmet-async';
import { enqueueSnackbar } from 'notistack';

import { Grid, Stack, Container, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useIsAccountRegisteredOperator } from '@/hooks/contract';

import { config } from '@/config';
import { primaryDark } from '@/theme/palette';
import { useSelectedOperators, useSelectedValidator } from '@/stores';

import Iconify from '@/components/iconify';
import { CardButton, CommonCard, CommonBack } from '@/components/common';

export default function ValidatorHomePage() {
  const result = useIsAccountRegisteredOperator();
  const router = useRouter();

  const { resetAll } = useSelectedOperators();

  const { isLidoCSMWithdrawalAddress } = useSelectedValidator();

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
          {isLidoCSMWithdrawalAddress() && (
            <Grid item xs={12} md={4}>
              <CommonCard
                title={
                  <>
                    {/* <Typography variant="caption" color="white" fontSize={18} fontWeight={700}>
                    Recommended:{' '}
                  </Typography> */}
                    <Typography variant="body1" color="white" fontSize={18} fontWeight={600}>
                      Participate in the Lido on Ethereum protocol as Node Operators.
                    </Typography>
                  </>
                }
                sx={{
                  backgroundColor: 'primary.main',
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <CardButton
                    isLoading={result.isLoading}
                    text="Using Lido CSM"
                    width={210}
                    onClick={async () => {
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
                        router.push(config.routes.validator.lidoCsmRegistration);
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
          )}

          {!isLidoCSMWithdrawalAddress() && (
            <Grid item xs={12} md={4}>
              <CommonCard
                title="Any validator can run on the SafeStake network: create a new validator."
                sx={{
                  backgroundColor: primaryDark.main,
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <CardButton
                    text="Using Launchpad"
                    width={210}
                    onClick={() => router.push(config.routes.validator.create)}
                  />
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
