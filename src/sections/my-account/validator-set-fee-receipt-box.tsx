import { Box, Skeleton, Typography } from '@mui/material';

import { useFeeReceiptAddress } from '@/hooks/contract/operator';

import { isAddressZero } from '@/utils';

type Props = {
  address: string;
};

export const ValidatorSetFeeReceiptBox = ({ address }: Props) => {
  const { getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);

  return (
    <Box sx={{ p: 2 }}>
      {getFeeRecipientAddressQuery.isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={22} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Fee Recipient Address: &nbsp;
          <Typography variant="body2" color="text.primary" display="inline" component="span">
            {isAddressZero(getFeeRecipientAddressQuery.data)
              ? address
              : getFeeRecipientAddressQuery.data}
          </Typography>
        </Typography>
      )}
    </Box>
  );
};
