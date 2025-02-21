import axios from 'axios';

import { getBaseBeaconchaUrl } from '@/utils/beaconcha';

import { IResponseValidatorBeaconItem } from '@/types';

enum ValidatorStatus {
  pending = 'pending',
  slashed = 'slashed',
  activeOnline = 'active_online',
  activeOffline = 'active_offline',
  slashing = 'slashing',
  exited = 'exited',
  exitingOnline = 'exiting_online',
}

const pendingMsg = 'Please wait while validator is being activated';
const checkValidatorMsg = 'Please check your validator status';
const activeMsg = 'The validator is currently in use';

export async function getBeaconchaValidatorsIsActive(publicKeys: string[]): Promise<boolean> {
  const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
  try {
    const response: any = (await axios.get(beaconChaValidatorUrl)).data;

    let isActive = false;

    if (response.data?.status === 'pending') {
      throw Error(pendingMsg);
    }

    if (response.data?.status === 'slashed') {
      throw Error(checkValidatorMsg);
    }

    if (Array.isArray(response.data)) {
      if (response.data.some((item) => item?.status === 'pending')) {
        throw Error(pendingMsg);
      }

      if (response.data.some((item) => item?.status === 'slashed')) {
        throw Error(checkValidatorMsg);
      }
    }

    if (response.data?.status === 'active_online') {
      isActive = true;
    }

    if (Array.isArray(response.data)) {
      if (response.data.some((item) => item?.status === 'active_online')) {
        isActive = true;
      }
    }

    if (isActive) {
      throw Error(activeMsg);
    }

    return isActive;
  } catch (err: any) {
    if (err.response?.status === 400) {
      throw Error(pendingMsg);
    }

    throw err;
  }
}

export type CommonValidatorsStatus = {
  success: boolean;
  message: string;
  data?: IResponseValidatorBeaconItem;
};

function getValidatorStatus(data: IResponseValidatorBeaconItem): CommonValidatorsStatus {
  switch (data.status) {
    case ValidatorStatus.pending:
      return {
        success: false,
        message: pendingMsg,
        data,
      };

    case ValidatorStatus.slashed:
    case ValidatorStatus.slashing:
    case ValidatorStatus.exited:
    case ValidatorStatus.exitingOnline:
      return {
        success: false,
        message: `${checkValidatorMsg}, the validator is ${data.status}`,
        data,
      };
    case ValidatorStatus.activeOnline:
    case ValidatorStatus.activeOffline:
      return {
        success: false,
        message: activeMsg,
        data,
      };
    default:
      return {
        success: true,
        message: '',
        data,
      };
  }
}

export async function getBeaconchaValidatorsIsActiveV2(publicKeys: string[]) {
  const mapKeys: Record<string, CommonValidatorsStatus> = publicKeys.reduce((acc, key) => {
    acc[key] = {
      success: false,
      message: pendingMsg,
    };
    return acc;
  }, {});

  try {
    const data = await getBeaconchaValidators(publicKeys);
    data.forEach((item) => {
      const status = getValidatorStatus(item);
      mapKeys[item.pubkey] = status;
    });
  } catch (err: any) {
    console.log(err);
  }

  return mapKeys;
}

export function checkValidatorMapSuccess(map: Record<string, CommonValidatorsStatus>) {
  return Object.values(map).every((item) => item.success);
}

/// https://holesky.beaconcha.in/api/v1/validator/afadfbe917373e6e7753f1557322689c4ad65d81f3e4395964873ddc7ae26f422c683e9a66cbc6ecb0077ce95717bf8c
/// validator's pubkey is pending currently, and return result
// {
//   "status": "ERROR: invalid validator argument, pubkey(s) did not resolve to a validator index",
//   "data": null
//   }

/// https://holesky.beaconcha.in/api/v1/validator/0xb0815cd864af09f850c4fe3d1d203a858788e1f4ed8f77a5e33c4e211dad81557a4fc8115ca6763a39472e7654b6c698
/// https://holesky.beaconcha.in/api/v1/validator/b0815cd864af09f850c4fe3d1d203a858788e1f4ed8f77a5e33c4e211dad81557a4fc8115ca6763a39472e7654b6c698,81d214246ae4ea96f18b8f0dd4a56ed0fef87f0c79a6652ce3743b029b4f0b88e2b58e471652914af756e49f8cb17182
/// https://holesky.beaconcha.in/api/v1/validator/b0815cd864af09f850c4fe3d1d203a858788e1f4ed8f77a5e33c4e211dad81557a4fc8115ca6763a39472e7654b6c698,81d214246ae4ea96f18b8f0dd4a56ed0fef87f0c79a6652ce3743b029b4f0b88e2b58e471652914af756e49f8cb17182,800000b3884235f70b06fec68c19642fc9e81e34fbe7f1c0ae156b8b45860dfe5ac71037ae561c2a759ba83401488e18,a686a627d9921007a6c0a6799057462f724df3f0c9961e3e4f0035a65f9e1e2b5f495b9baa7a15779056d130be17c418
export async function getBeaconchaValidators(publicKeys: string[]) {
  const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
  const response: any = (await axios.get(beaconChaValidatorUrl)).data;

  const data: IResponseValidatorBeaconItem[] = Array.isArray(response.data)
    ? response.data
    : [response.data];

  return data;
}

export function filterExitedOrSlasedValidators(data: IResponseValidatorBeaconItem[]) {
  const items = data.filter((validator) => {
    // slashing need to add?
    const isExited = [
      ValidatorStatus.exited,
      ValidatorStatus.exitingOnline,
      ValidatorStatus.slashed,
      ValidatorStatus.slashing,
    ].includes(validator.status as ValidatorStatus);
    return !isExited;
  });

  return items;
}

/// https://holesky.beaconcha.in/api/v1/epoch/latest
export async function getLatestEpoch() {
  const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/epoch/latest`;
  const response: any = (await axios.get(beaconChaValidatorUrl)).data;

  return response;
}

export const getIsDeposited = async (keys: string[]): Promise<boolean> => {
  const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${keys.join(',')}/deposits`;

  try {
    const response: any = (await axios.get(beaconChaValidatorUrl)).data;
    if (Array.isArray(response.data) && response.data.length === 0) {
      return false;
    }

    const conditionalDataExtraction = response.data;
    const result = conditionalDataExtraction?.every((item) => item?.valid_signature === true);
    return result;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
};
