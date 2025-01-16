import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAccount, useSignMessage } from 'wagmi';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import services from '@/services';

import { CommonBlock } from '@/components/common';
import { enqueueSnackbar } from '@/components/snackbar';
import FormProvider, { RHFTextField } from '@/components/hook-form';

const verifyFormSchema = z.object({
  address: z.string().min(1, {
    message:
      'Verify your eligibility as a validator operator to ensure others can discover and select you as one of their operators.',
  }),
  discordId: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address, please check your input.' }),
});
type FormSchema = z.infer<typeof verifyFormSchema>;
export default function OperatorVerifyForm() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const defaultValues = {
    address,
    discordId: '',
    email: '',
  };

  const methods = useForm<FormSchema>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', data);
    const signData = {
      email: data.email,
      owner: address,
      discord: data.discordId || '-',
      v: Date.now(),
    };
    try {
      const sig = await signMessageAsync({
        message: JSON.stringify(signData),
      });
      await services.user.bind(
        {
          ...signData,
          sign_hex: sig,
        },
        sig!
      );
      enqueueSnackbar('Submit successful!', {
        variant: 'success',
      });
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      enqueueSnackbar(error.details || error.message, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="body1" textAlign="center" color="text.secondary">
          Verify your eligibility as a validator operator to ensure others can discover and select
          you as one of their operators.
        </Typography>
        <CommonBlock
          label="Owner Address"
          tooltip={
            <Typography variant="body1" textAlign="center">
              The operator’s admin address for management purposes.
            </Typography>
          }
        >
          <RHFTextField name="address" type="text" disabled value={address} />
        </CommonBlock>
        <CommonBlock label="Discord ID">
          <RHFTextField name="discordId" type="text" />
        </CommonBlock>
        <CommonBlock label="Email">
          <RHFTextField name="email" type="text" />
        </CommonBlock>

        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="soft"
          loading={isSubmitting}
        >
          Next
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
