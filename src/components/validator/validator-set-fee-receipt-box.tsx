import { Box, Stack, Tooltip, Skeleton, IconButton, Typography } from '@mui/material';

import { useBoolean } from '@/hooks/use-boolean';
import { useFeeReceiptAddress } from '@/hooks/contract/operator';

import { isAddressZero } from '@/utils';

import Iconify from '@/components/iconify';
import { ValidatorSetFeeReceiptDialog } from '@/components/validator/validator-set-fee-receipt-dialog';

type Props = {
  address: string;
};

export const ValidatorSetFeeReceiptBox = ({ address }: Props) => {
  const { getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);
  const { value: feeReceiptDialogOpen, ...setFeeReceiptDialogOpen } = useBoolean(false);

  return (
    <>
      <Box sx={{ p: 2 }}>
        {getFeeRecipientAddressQuery.isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={22} />
        ) : (
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Fee Recipient Address: &nbsp;
            </Typography>

            <Typography variant="body2" color="text.primary" display="inline" component="span">
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="body2" color="text.secondary">
                  {isAddressZero(getFeeRecipientAddressQuery.data)
                    ? address
                    : getFeeRecipientAddressQuery.data}
                </Typography>
                <Tooltip title="Update Fee Recipient Address" placement="top">
                  <IconButton onClick={setFeeReceiptDialogOpen.onTrue}>
                    <Iconify width={24} icon="mingcute:edit-line" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Typography>
          </Stack>
        )}
      </Box>

      <ValidatorSetFeeReceiptDialog
        dialogOpen={feeReceiptDialogOpen}
        onClose={setFeeReceiptDialogOpen.onFalse}
      />
    </>
  );
};
