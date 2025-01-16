import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAccount, useSignMessage } from 'wagmi';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import { Card, Container, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import services from '@/services';
import { config } from '@/config';

import { CommonBack, CommonBlock } from '@/components/common';
import { useGlobalConfig } from '@/components/global-config-init';
import FormProvider, { RHFTextField } from '@/components/hook-form';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type FormSchema = z.infer<typeof schema>;

export default function ValidatorEmailPage() {
  const { tokenInfo } = useGlobalConfig();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

  const defaultValues = {
    email: '',
  };

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async ({ email }) => {
    const signData = {
      email,
      owner: address,
      discord: '-',
      v: Date.now(),
    };

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
    router.push(config.routes.validator.import);
  });

  return (
    <Container maxWidth="xl">
      <CommonBack />
      <Typography variant="h2" textAlign="center" pt={3}>
        Confirm your
        <Typography display="inline" variant="inherit" sx={{ color: 'primary.main', px: 1 }}>
          Email
        </Typography>
      </Typography>
      <Card
        sx={{
          py: 6,
          px: { md: 6, xs: 2 },
          maxWidth: 716,
          margin: '0 auto',
          mt: 6,
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              We will notify you via email when your ${tokenInfo.symbol} account balance is too low.
            </Typography>
            <CommonBlock label="Email">
              <RHFTextField name="email" type="text" />
            </CommonBlock>

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="soft"
              loading={isSubmitting}
            >
              Next
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Container>
  );
}
