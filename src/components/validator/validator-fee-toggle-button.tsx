import { useState } from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/lab';

import { config } from '@/config';
import { CurrentFeeMode } from '@/types';

interface ValidatorFeeToggleButtonProps {
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
