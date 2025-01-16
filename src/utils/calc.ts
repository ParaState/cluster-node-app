import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { PerformanceTypeEnum, IResponseOperatorPerformance } from '@/types';

dayjs.extend(utc);
dayjs.extend(tz);

export const getPerformanceParams = (filter: any, performance: PerformanceTypeEnum) => {
  const now = dayjs().utc();
  console.log(now.format());

  const body = {
    filter: {
      ...filter,
      year: now.get('year'),
      month: now.get('month') + 1,
    },
  };

  if (performance === PerformanceTypeEnum.oneDay) {
    body.filter.day = now.get('date');
  }

  return body;
};

export const calcPerformance = (performance?: IResponseOperatorPerformance): string => {
  if (!performance) return '0';

  const attested = Number(performance.attested);
  const missed = Number(performance.missed);

  const total = attested + missed;

  return total === 0 ? '0' : ((attested / total) * 100).toFixed(2);
};
