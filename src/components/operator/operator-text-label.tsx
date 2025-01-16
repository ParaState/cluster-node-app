import { IResponseOperator, OperatorTypeDescEnum } from '@/types';

import Label from '../label';

type Props = {
  operator: IResponseOperator;
};

export const OperatorTextLabel = ({ operator }: Props) => {
  if (!operator) return null;
  // if (!type || type === IResponseOperatorTypeEnum.NORMAL_NODE) return '';

  // const labelText = type === IResponseOperatorTypeEnum.VERIFIED_NODE ? 'Verified' : 'DAO';

  if (operator.fromDao === 1) {
    return (
      // <Label variant="soft" color="success">
      <Label variant="soft" color="info">
        {OperatorTypeDescEnum.dao}
      </Label>
    );
  }

  if (operator.verified === 1) {
    return (
      <Label variant="soft" color="info">
        {OperatorTypeDescEnum.verified}
      </Label>
    );
  }

  return null;
};
