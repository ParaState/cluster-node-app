import { Link, Stack, Typography } from '@mui/material';

import { config } from '@/config';

type Props = {
  operators: {
    operator_id: number;
    operator_name: string;
    name?: string;
  }[];
};

export const OperatorLinksList = ({ operators }: Props) => {
  return (
    <Stack
      alignItems="center"
      sx={{
        flexDirection: { md: 'row', xs: 'column' },
      }}
    >
      {operators.map((operator, kindex) => (
        <Typography key={`${kindex}`} variant="body2">
          <Link href={`${config.links.operator(operator.operator_id)}`} target="_blank">
            {operator?.operator_name || operator?.name}
          </Link>
          &nbsp;
        </Typography>
      ))}
    </Stack>
  );
};
