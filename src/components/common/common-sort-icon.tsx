import { SvgIcon } from '@mui/material';

import { SortTypeEnum } from '@/types';
import { SortArrowsIcon, SortAscendingIcon, SortDescendingIcon } from '@/assets/icons';

type Props = {
  sort?: SortTypeEnum;
  isActive: boolean;
};

export const CommonSortIcon = ({ sort, isActive = false }: Props) => {
  if (!sort || !isActive) {
    return (
      <SvgIcon>
        <SortArrowsIcon />
      </SvgIcon>
    );
  }

  if (sort === SortTypeEnum.asc) {
    return (
      <SvgIcon>
        <SortAscendingIcon />
      </SvgIcon>
    );
  }

  return (
    <SvgIcon>
      <SortDescendingIcon />
    </SvgIcon>
  );
};
