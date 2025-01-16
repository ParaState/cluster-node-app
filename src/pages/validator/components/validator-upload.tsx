import { Box, Typography } from '@mui/material';

import { config } from '@/config';

export function ValidatorUploadDesc() {
  return (
    <>
      <ValidatorKeySecurityInfo />
      <ValidatorFileImportInfo />
      <ValidatorFileNameInfo />
    </>
  );
}

export function ValidatorKeySecurityInfo() {
  return (
    <Typography variant="body1" textAlign="center" color="text.secondary">
      Your validator key is secured - it’s not stored anywhere and never sent to our servers.
    </Typography>
  );
}

export function ValidatorFileImportInfo() {
  return (
    <Typography variant="body1" textAlign="center" color="text.secondary">
      You can import up to {config.maxKeyStoreFiles} keystore files
    </Typography>
  );
}

export function ValidatorFileNameInfo() {
  return (
    <Typography variant="body1" textAlign="center" color="text.secondary">
      File name most likely starts with{' '}
      <Box
        sx={{
          fontFamily: 'monospace',
          display: 'inline-block',
          bgcolor: 'grey.200',
          p: 0.5,
          px: 1,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        keystore
      </Box>
    </Typography>
  );
}
