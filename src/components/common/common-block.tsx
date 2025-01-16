import { Stack, Tooltip, StackProps, Typography } from '@mui/material';

import Iconify from '@/components/iconify';

interface BlockProps extends StackProps {
  label: string;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
}

export const CommonBlock = ({ label, sx, children, tooltip }: BlockProps) => {
  return (
    <Stack spacing={1} sx={{ width: 1, ...sx }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          variant="caption"
          sx={{
            textAlign: 'left',
            fontStyle: 'Barlow',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip}>
            <Iconify textAlign="center" width={16} icon="raphael:info" color="text.secondary" />
          </Tooltip>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
