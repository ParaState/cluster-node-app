import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

import Encryption from '@/utils/crypto/Encryption/Encryption';
import { Threshold, ISharesKeyPairs } from '@/utils/crypto/Threshold';

import { CurrentFeeMode } from '@/types';
import { useSelectedOperators } from '@/stores';
import { networkContract } from '@/config/contract';

import { useGlobalConfig } from '@/components/global-config-init';

const errorMap = {
  A1: 'Validator already exists',

  D1: 'The length of the registered validator public key is incorrect',
  D2: 'Shares key is not valid',

  E2: 'You have already registered operator, you cannot register validator',

  E5: 'The current account has reached the upper limit of validators allowed',
};

export const useRegisterValidator = () => {
  type RegisterValidatorParamsType = Awaited<ReturnType<typeof createRegisterValidatorParams>>;

  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { selectedOperators, keyStorePrivateKeys, currentCommitteeSize } = useSelectedOperators();
  const { getSubscriptionFeeFeeByFeeMode } = useGlobalConfig();

  const isBatchRegister = keyStorePrivateKeys.length > 1;

  const { address } = useAccount();

  const prepareContractConfig = (params: RegisterValidatorParamsType) => {
    // console.group('estimateGasForRegisterValidator');
    // console.log(JSON.stringify(params.validatorPublicKeys));
    // console.log(JSON.stringify(params.operatorIds));
    // console.log(JSON.stringify(params.sharePublicKeys));
    // console.log(JSON.stringify(params.sharesEncrypted.map((item) => item)));
    // console.log(params.paySubscriptionFee);
    // console.log(networkContract.address);
    // console.groupEnd();

    if (isBatchRegister) {
      const eachAmount = params.paySubscriptionFee / BigInt(keyStorePrivateKeys.length);

      return {
        ...networkContract,
        functionName: 'batchRegisterValidator',
        account: address,
        args: [
          params.validatorPublicKeys,
          params.operatorIds,
          params.sharePublicKeys,
          params.sharesEncrypted,
          keyStorePrivateKeys.length,
          eachAmount,
        ],
      };
    }

    return {
      ...networkContract,
      functionName: 'registerValidator',
      account: address,
      args: [
        params.validatorPublicKeys[0],
        params.operatorIds,
        params.sharePublicKeys[0],
        params.sharesEncrypted[0],
        params.paySubscriptionFee,
      ],
    };
  };

  const registerValidator = async (params: RegisterValidatorParamsType) => {
    const contractConfig = prepareContractConfig(params);

    const hash = await writeContractAsync(contractConfig as any);

    await client?.waitForTransactionReceipt({
      hash,
    });
  };

  // const checkInvalidPublicKeyLength = (publicKeys: string[]): boolean => {
  //   const result = publicKeys.every((publicKey) => {
  //     const key = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
  //     const publicKeyBuf = Buffer.from(key, 'hex');
  //     return publicKeyBuf.length !== 48;
  //   });
  //   console.log(`checkInvalidPublicKeyLength: ${result}`);
  //   return result;
  // };

  const registerValidatorEstimation = async (params: RegisterValidatorParamsType) => {
    const contractConfig = prepareContractConfig(params);

    // const publicKeys = params.validatorPublicKeys;
    // const { operatorIds } = params;

    try {
      await client?.estimateContractGas(contractConfig as any);
      return undefined;
    } catch (error) {
      console.log('🚀 ~ registerValidatorEstimation ~ error:\n', error?.message);

      if (error?.name === 'ContractFunctionExecutionError') {
        const reason = error?.cause?.reason;
        const msg = errorMap[reason];

        if (msg) {
          return new Error(msg);
        }
      }

      return error;
      // console.error(error);
      // // handle error InvalidPublicKeyLength
      // const isInvalidPublicKeyLength = checkInvalidPublicKeyLength(publicKeys);
      // if (isInvalidPublicKeyLength) {
      //   return new Error('The length of the registered validator public key is incorrect');
      // }
      // // handle error ValidatorAlreadyExists
      // const isValidatorAlreadyExists = await dvfStore.checkValidatorAlreadyExists(publicKeys);
      // if (isValidatorAlreadyExists) {
      //   return new Error('Validator already exists');
      // }
    }
  };

  const createRegisterValidatorParams = async (currentFeeMode: CurrentFeeMode) => {
    const operatorIds = selectedOperators.map((operator) => operator.id);

    const thresholdResults: ISharesKeyPairs[] = await Promise.all(
      keyStorePrivateKeys.map(async (key) => {
        const threshold: Threshold = new Threshold(
          currentCommitteeSize.sharesNumber,
          currentCommitteeSize.threshold
        );
        const result: ISharesKeyPairs = await threshold.create(key, operatorIds);
        return result;
      })
    );

    try {
      const operatorLength = selectedOperators.length;
      const paySubscriptionFee = getSubscriptionFeeFeeByFeeMode(
        currentFeeMode,
        keyStorePrivateKeys.length
      );

      const operatorPublicKeyOrigin: string[] = selectedOperators.map((operator) => {
        return operator.pk;
      });

      const sharePublicKeys = thresholdResults.map((item) => {
        return item.shares.map((share) => {
          return share.publicKey;
        });
      }) as `0x${string}`[][];

      const encryptedShares = thresholdResults.map((item) => {
        try {
          const encryptedShare = new Encryption(operatorPublicKeyOrigin, item.shares).encrypt();
          return encryptedShare;
        } catch (error) {
          console.error('🚀 ~ ValidatorStore ~ encryptedShares ~ error:', error);
          throw error;
        }
      });

      const encryptedKeysBuffer = encryptedShares.map((shares) => {
        return shares.map((share) => {
          return `0x${Buffer.from(share.privateKey, 'base64').toString('hex')}`;
        });
      }) as `0x${string}`[][];

      const params = {
        validatorPublicKeys: thresholdResults.map(
          (result) => result.validatorPublicKey
        ) as `0x${string}`[],
        operatorIds,
        sharePublicKeys,
        sharesEncrypted: encryptedKeysBuffer,
        validatorKeyStoreLegnth: keyStorePrivateKeys.length,
        operatorLength,
        paySubscriptionFee,
      };

      return params;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    registerValidator,
    registerValidatorEstimation,
    createRegisterValidatorParams,
  };
};
