import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/lab';

import { formatEtherWithIntl } from '@/utils/format';

import { config } from '@/config';
import { CurrentFeeMode } from '@/types';

import { useGlobalConfig } from '@/components/global-config-init';

import { ImportTokenLink } from './import-token-link';

export interface ValidatorFeeToggleButtonProps {
  onChange: (value: CurrentFeeMode) => void;
}

export function ValidatorFeeToggleButton(props: ValidatorFeeToggleButtonProps) {
  const { onChange } = props;
  const [feeMode, setFeeMode] = useState(CurrentFeeMode.month);

  const handleChange = (e, value: any) => {
    setFeeMode(value);
    onChange(value);
  };

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={feeMode}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value={CurrentFeeMode.month}>Monthly</ToggleButton>
      <ToggleButton value={CurrentFeeMode.year}>Yearly</ToggleButton>
      {config.isDevnet && <ToggleButton value={CurrentFeeMode.minimum}>Minimum</ToggleButton>}
    </ToggleButtonGroup>
  );
}

export function ValidatorTotalFeeToggleButton({ onChange }: ValidatorFeeToggleButtonProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" width={1}>
      <Typography variant="body1">
        Total fee <ImportTokenLink />
      </Typography>

      <ValidatorFeeToggleButton onChange={onChange} />
    </Stack>
  );
}

interface ValidatorSubscriptionFeeProps {
  currentFeeMode: CurrentFeeMode;
  currentFee: bigint;
}

export function ValidatorSubscriptionFee({
  currentFeeMode,
  currentFee,
}: ValidatorSubscriptionFeeProps) {
  const { tokenInfo } = useGlobalConfig();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4} width={1}>
      <Typography variant="body1" color="text.primary">
        ≈ {formatEtherWithIntl(currentFee)}
      </Typography>
      <Typography variant="body1">
        {tokenInfo.symbol}/per {currentFeeMode}
      </Typography>
    </Stack>
  );
}
