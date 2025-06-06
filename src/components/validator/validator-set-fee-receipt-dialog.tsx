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
  Link,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useFeeReceiptAddress } from '@/hooks/contract';

import { config } from '@/config';
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

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (getFeeRecipientAddressQuery.data) {
      form.setValue(
        'address',
        isAddressZero(getFeeRecipientAddressQuery.data)
          ? address!
          : getFeeRecipientAddressQuery.data!
      );
    }
  }, [getFeeRecipientAddressQuery.data]);

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // const addressType = methods.watch('addressType');

  const onSubmit = handleSubmit(async (formValue) => {
    // const pubkeys = isAddressEqual(address!, (formValue as any).address) ? [] : pks;

    // console.log(JSON.stringify([pubkeys, formValue.address]));
    // console.log(pubkeys[0]);

    try {
      // await batchSetFeeReceiptAddress(pubkeys, formValue.address);
      // Check if the address is the same as the current fee recipient address
      if (formValue.address === getFeeRecipientAddressQuery.data) {
        enqueueSnackbar('Fee recipient address is already set to this address', {
          variant: 'info',
        });
        onClose();
        return;
      }
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
      maxWidth="sm"
      fullWidth
      open={dialogOpen}
      // onClose={() => {
      //   resetClaim();
      //   onClose();
      // }}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Stack direction="row" alignItems="center">
          <Typography component="div" variant="subtitle1">
            Update Fee Recipient Address
          </Typography>

          <Link
            sx={{ cursor: 'pointer' }}
            variant="body2"
            underline="always"
            onClick={() => {
              form.setValue('address', config.contractAddress.lidoFeeRecipient);
            }}
          >
            (Fill Lido CSM fee recipient address)
          </Link>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <FormProvider methods={form} onSubmit={onSubmit}>
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
