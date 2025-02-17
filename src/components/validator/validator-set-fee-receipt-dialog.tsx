import { z } from 'zod';
import { isAddress } from 'viem';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useFeeReceiptAddress } from '@/hooks/contract';

import { isAddressZero } from '@/utils';

import FormProvider, { RHFTextField } from '@/components/hook-form';

type Props = {
  dialogOpen: boolean;
  onClose: () => void;
};

const schema = z.object({
  address: z.string().refine((value) => isAddress(value), {
    message: 'Address is invalid.',
  }),
  // addressType: z.string(),
});

enum AddressType {
  owner = 'owner',
  custom = 'custom',
}

type FormSchema = z.infer<typeof schema>;

export const ValidatorSetFeeReceiptDialog = ({ dialogOpen, onClose }: Props) => {
  const { address } = useAccount();
  const { setFeeRecipientAddress, getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);
  // console.log(
  //   '🚀 ~ ValidatorSetFeeReceiptDialog ~ getFeeRecipientAddressQuery:',
  //   getFeeRecipientAddressQuery.data
  // );
  // const { data } = useValidatorInfo(pks);
  // console.log(data);

  const defaultValues = {
    address: getFeeRecipientAddressQuery.data || address,
    addressType: AddressType.owner,
  };

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (getFeeRecipientAddressQuery.data) {
      methods.setValue(
        'address',
        isAddressZero(getFeeRecipientAddressQuery.data)
          ? address!
          : getFeeRecipientAddressQuery.data!
      );
    }
  }, [getFeeRecipientAddressQuery.data, address, methods]);

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  // const addressType = methods.watch('addressType');

  const onSubmit = handleSubmit(async (formValue) => {
    // const pubkeys = isAddressEqual(address!, (formValue as any).address) ? [] : pks;

    // console.log(JSON.stringify([pubkeys, formValue.address]));
    // console.log(pubkeys[0]);

    try {
      // await batchSetFeeReceiptAddress(pubkeys, formValue.address);
      await setFeeRecipientAddress(formValue.address);
      // await setFeeReceiptAddress(pubkeys[0], formValue.address);
      await getFeeRecipientAddressQuery.refetch();
      enqueueSnackbar('Fee receipt address set success', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar(error.details || error.message, { variant: 'error' });
      console.log('🚀 ~ setFeeReceiptAddress ~ error:', error);
      console.log(error);
    }
  });

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={dialogOpen}
      // onClose={() => {
      //   resetClaim();
      //   onClose();
      // }}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Typography component="div" variant="subtitle1">
          Set fee recipient address
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <RHFTextField
              name="address"
              type="text"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Enter address"
              // disabled={addressType === AddressType.owner}
            />

            {/* <RHFRadioGroup
              row
              name="addressType"
              spacing={4}
              options={[
                { value: AddressType.owner, label: 'Owner' },
                { value: AddressType.custom, label: 'Custom Address' },
              ]}
            /> */}
          </FormProvider>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={onClose} color="primary">
          Cancel
        </Button>

        <LoadingButton
          variant="soft"
          type="submit"
          onClick={onSubmit}
          color="primary"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
