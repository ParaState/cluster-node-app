import { UseFormReturn, FormProvider as Form } from 'react-hook-form';

import { Box, SxProps } from '@mui/material';

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  sx?: SxProps;
};

export default function FormProvider({ children, onSubmit, methods, sx }: Props) {
  return (
    <Form {...methods}>
      <Box component="form" onSubmit={onSubmit} sx={{ ...sx }}>
        {children}
      </Box>
    </Form>
  );
}
