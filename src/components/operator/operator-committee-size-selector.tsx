import { Box, ToggleButton } from '@mui/material';

import { config } from '@/config';
import { useSelectedOperators } from '@/stores';

// const COLORS = ['standard', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

export const OperatorCommitteeSizeSelector = () => {
  const { currentCommitteeSize, setCurrentCommitteeSize, selectedOperators, setSelectedOperators } =
    useSelectedOperators();

  // console.log(selectedOperators);
  return (
    <>
      {/* <ToggleButtonGroup sx={{ border: 'none' }} color="secondary" exclusive value="check"> */}
      {config.operatorThresholdList.map((item, index) => (
        <ToggleButton
          key={index}
          value="check"
          // value={item}
          color="secondary"
          selected={currentCommitteeSize === item}
          size="small"
          onClick={() => {
            setCurrentCommitteeSize(item);
            setSelectedOperators(selectedOperators.slice(0, item.sharesNumber));
          }}
        >
          <Box width={120}>{item.sharesNumber}</Box>
        </ToggleButton>
      ))}
      {/* </ToggleButtonGroup> */}
    </>
  );
};
