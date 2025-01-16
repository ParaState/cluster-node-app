import { Helmet } from 'react-helmet-async';

import { Grid, Stack, Button, Container, Typography } from '@mui/material';

import { config } from '@/config';

import Image from '@/components/image';
import { CommonBack } from '@/components/common';

export default function ValidatorCreatePage() {
  return (
    <>
      <Helmet>
        <title> ValidatorCreatePage</title>
      </Helmet>

      <Container>
        <CommonBack />
        <Typography variant="h2" py={6} textAlign="center">
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Visit
          </Typography>
          Ethereum Launchpad
        </Typography>
        <Grid
          container
          spacing={2}
          p={4}
          justifyContent="space-between"
          sx={{
            border: '2px solid #110E65',
            borderRadius: 3.75,
            margin: '0 auto',
            position: 'relative',
          }}
          maxWidth={{ md: 716 }}
        >
          <Grid item xs={12} md={6}>
            <Stack spacing={2} fontWeight={500}>
              <Typography variant="body1">
                You must have an active validator before running it on the SafeStake network.
              </Typography>
              <Typography variant="body1">
                Follow Ethereum’s launchpad instructions to generate new keys and deposit your
                validator to the deposit contract.
              </Typography>
              <Typography variant="body1">
                Please note to backup your newly created validator files, you will need them for our
                setup.
              </Typography>
              <Button
                href={config.links.launchpadLink}
                target="_blank"
                variant="outlined"
                size="large"
                sx={{
                  color: '#110E65',
                  borderRadius: '26px',
                  borderColor: '#110E65 !important',
                  borderWidth: '2px',
                  mt: 2,
                  '&:hover': {
                    color: '#f9fbfc',
                    backgroundColor: '#110E65',
                  },
                }}
              >
                Visit Ethereum Launchpad
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Image
              alt="validator"
              src="/images/light.png"
              variant="rounded"
              objectFit="contain"
              sx={{
                width: 370,
                position: 'absolute',
                right: { md: '-20%', sx: 0 },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
