import { m } from 'framer-motion';

import { Stack, Button, Container, Typography } from '@mui/material';

import { RouterLink } from '@/routes/components';

import MainLayout from '@/layouts/main';
import { HEADER } from '@/layouts/config-layout';

import { varBounce, MotionContainer } from '@/components/animate';

type Props = {
  title: string;
  desc: string;
  buttonText?: string;
  onClick?: () => void;
};

export const CommonNotFound = ({ title, desc, buttonText, onClick }: Props) => (
  <MainLayout>
    <Container component="main">
      <Stack
        sx={{
          py: 12,
          m: 'auto',
          maxWidth: 600,
          minHeight: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {title}
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>{desc}</Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Button sx={{ mt: 3 }} component={RouterLink} href="/" size="large" variant="contained">
              Go to Home
            </Button>
          </m.div>
        </MotionContainer>
      </Stack>
    </Container>
  </MainLayout>
);
