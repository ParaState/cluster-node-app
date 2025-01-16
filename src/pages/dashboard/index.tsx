import { Box, Grid, Card, Container, Typography } from '@mui/material';

export default function Page() {
  return (
    <Container maxWidth="xl">
      <Typography
        variant="h2"
        mt={{
          xs: 4,
          md: 8,
        }}
        align="center"
      >
        My Account
      </Typography>

      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3, flexGrow: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Current Block Height</Typography>
              <Typography variant="h3" sx={{ fontSize: 40 }}>
                {123123}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">DVT Balance</Typography>
              <Typography variant="h3" sx={{ fontSize: 40 }}>
                {123123}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">DVT Balance</Typography>
              <Typography variant="h3" sx={{ fontSize: 40 }}>
                {123123}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
