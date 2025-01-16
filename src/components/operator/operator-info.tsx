import Stack from '@mui/material/Stack';
import { Box, Link, Typography } from '@mui/material';

import { longStringShorten } from '@/utils/string';

import { config } from '@/config';
import { IResponseOperator } from '@/types';

import Iconify from '@/components/iconify';
import CopyButton from '@/components/copy-button';

import { OperatorLogo } from './operator-logo';
import { OperatorType } from './operator-type';

type Props = {
  operator: IResponseOperator;
  onRemoveClick?: (operator: IResponseOperator) => void;
  showLinks?: boolean;
  canCopy?: boolean;
};

export const OperatorInfo = ({
  operator,
  onRemoveClick,
  showLinks = false,
  canCopy = false,
}: Props) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <OperatorLogo logo={operator.operator_detail?.logo} />
      <Stack direction="column" spacing={0.5}>
        <Stack direction="row" alignItems="center">
          <Typography sx={{ color: `text.primary` }}>{operator.name}</Typography>
          <OperatorType operator={operator} />
        </Stack>
        <Stack direction="row" alignItems="center">
          {showLinks ? (
            <Link href={`${config.links.operator(operator.id)}`} target="_blank">
              {longStringShorten(operator.pk)}
            </Link>
          ) : (
            <Typography variant="body2" sx={{ color: `text.disabled` }}>
              {longStringShorten(operator.pk)}
            </Typography>
          )}

          {canCopy && <CopyButton text={operator.pk} />}
        </Stack>
      </Stack>

      {onRemoveClick && (
        <Iconify
          icon="icons8:minus"
          color="error"
          onClick={() => onRemoveClick(operator)}
          sx={{
            cursor: 'pointer',
          }}
        />
      )}
    </Stack>
  );
};

export const OperatorInfoContainer = ({ operator }: Omit<Props, 'onRemoveClick'>) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        height: 70,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        px: 4,
      }}
    >
      <OperatorInfo operator={operator} />
    </Box>
  );
};
