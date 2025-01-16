import { isNil } from 'lodash';
import { parseUnits, formatEther, formatUnits } from 'viem';

import {
  IResponseOperator,
  IResponseOperators,
  IResponseOperatorStatusEnum,
  IResponseClaimRecordItemEventData,
} from '@/types';

export const renderOperatorStatus = (operator: IResponseOperator) => {
  if (operator.validator_count === 0 && operator.status === 'inactive') {
    return IResponseOperatorStatusEnum.ready;
  }

  return operator.status;
};

export const renderOperatorStatusColor = (operator: IResponseOperator) => {
  const status = renderOperatorStatus(operator);
  switch (status) {
    case IResponseOperatorStatusEnum.ative:
      return 'success.main';
    case IResponseOperatorStatusEnum.inactive:
      return 'error.main';
    case IResponseOperatorStatusEnum.ready:
      return 'warning.main';
    default:
      return 'text.primary';
  }
};

export const renderOperatorStatusLabelColor = (operator: IResponseOperator) => {
  const status = renderOperatorStatus(operator);
  switch (status) {
    case IResponseOperatorStatusEnum.ative:
      return 'success';
    case IResponseOperatorStatusEnum.inactive:
      return 'error';
    case IResponseOperatorStatusEnum.ready:
      return 'warning';
    default:
      return 'default';
  }
};

// console.log(hexToBase64('0x03f9f9e1ae738ee3d388a263a8e1fe5443fc2020e4e9aa5cc13ba1b4ecb50ed51e0'));

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

/// walletStore.fromWei
export const formatEtherFixed = (wei: string | bigint | number, fixed = 2) => {
  if (!wei) return '0';
  if (typeof wei === 'bigint') {
    return (+formatEther(wei)).toFixed(fixed);
  }
  const value = BigInt(+wei);
  return (+formatEther(value)).toFixed(fixed);
};

export const formatPerformance = (value: bigint, fixed = 4) => {
  if (!value) return '0';
  return (+formatUnits(value, 10)).toFixed(fixed);
};

/// walletStore.toWei
export const parseToWei = (ether: string) => {
  if (!ether) return 0n;

  return BigInt(parseUnits(ether, 18));
};

export const parseVersion = (v: string) => {
  const version = +v;

  const rootVersion = Math.floor(version / 1000_000_000_000);
  const majorVersion = Math.floor((version / 1000_000) % 1000);
  const minorVersion = +v.substring(v.length - 2, v.length);

  return {
    rootVersion,
    majorVersion,
    minorVersion,
  };
};

export const formatVersion = (v: string) => {
  if (isNil(v)) return 'unkown';
  // const { rootVersion, majorVersion, minorVersion } = parseVersion(v);
  const { majorVersion, minorVersion } = parseVersion(v);

  return `${majorVersion}.${minorVersion}`;
};

export const formatClaimEventData = (eventData: string) => {
  let data = {} as IResponseClaimRecordItemEventData;
  try {
    data = JSON.parse(eventData);
  } catch (e) {
    console.error(e);
  }

  if (Object.keys(data).length === 0) {
    return {
      nonce: '',
      to: '',
      claimed: '-',
      penalty: '-',
      blockNumber: '',
    };
  }

  return {
    ...data,
    claimed: formatEtherFixed(data.claimed),
    penalty: formatEtherFixed(data.penalty),
  };
};

export const calcOperatorEarning = (
  operatorQuery: IResponseOperators = {
    rows: [],
    count: 0,
  }
): bigint => {
  const earnings: bigint[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const operator of operatorQuery.rows) {
    const { earning, month_performance } = operator;
    const { attested, missed, performance } = month_performance;

    if (performance === 0 || attested === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (attested > 0 && missed > 0) {
      const v = (BigInt(earning) * BigInt(Math.floor(performance))) / 100n;
      earnings.push(v);
    }
  }

  const total = earnings.reduce((acc, cur) => acc + cur, 0n);

  return total;
};
