import { Tooltip } from '@mui/material';

import { IResponseOperator, OperatorTypeDescEnum } from '@/types';

import Iconify from '@/components/iconify';

type Props = {
  operator: IResponseOperator;
};

export const OperatorType = ({ operator }: Props) => {
  if (!operator) return null;

  if (operator.fromDao === 1) {
    return (
      <Tooltip title={OperatorTypeDescEnum.dao}>
        {/* <SvgIcon>
          <DaoIcon ml={0.5} />
        </SvgIcon> */}
        <Iconify ml={0.5} color="info.main" textAlign="center" width={16} icon="healthicons:yes" />
      </Tooltip>
    );
  }

  if (operator.verified === 1) {
    return (
      <Tooltip title={OperatorTypeDescEnum.verified}>
        <Iconify ml={0.5} color="#21D7B5" textAlign="center" width={16} icon="healthicons:yes" />
        {/* <VerifiedIcon /> */}
      </Tooltip>
    );
  }

  return null;
};
