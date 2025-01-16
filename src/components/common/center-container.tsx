import { Stack, Container } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

export const CenterContainer = ({ children }: Props) => (
  <Container maxWidth="md" sx={{ width: '100%', height: '100%' }}>
    <Stack alignItems="center" justifyContent="center" height={1}>
      {children}
    </Stack>
  </Container>
);
