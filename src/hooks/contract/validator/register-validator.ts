import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

import { networkContract } from '@/config/contract';
import { IResponseClusterNodeValidatorItem } from '@/types';

const errorMap = {
  A1: 'Validator already exists',

  D1: 'The length of the registered validator public key is incorrect',
  D2: 'Shares key is not valid',

  E2: 'You have already registered operator, you cannot register validator',

  E5: 'The current account has reached the upper limit of validators allowed',
};

export const useRegisterValidator = () => {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  // const { currentCommitteeSize } = useSelectedOperators();
  // const { getSubscriptionFeeFeeByFeeMode } = useGlobalConfig();

  const { address } = useAccount();

  const prepareClusterNodeContractConfig = (
    validators: IResponseClusterNodeValidatorItem[],
    paySubscriptionFee: bigint
  ) => {
    const isBatch = validators.length > 1;

    const validatorPublicKeys = validators.map((validator) => validator.pubkey);

    const validatorOperatorIds = validators.map((validator) =>
      validator.operators.map((operator) => BigInt(operator.operator_id))
    );
    const validatorSharedKeys = validators.map((validator) =>
      validator.operators.map((operator) => operator.shared_key)
    );
    const validatorEncryptKeys = validators.map((validator) =>
      validator.operators.map((operator) => operator.encrypt_key)
    );

    console.log(
      '🚀 ~ useRegisterValidator ~ validatorPublicKeys:',
      JSON.stringify(validatorPublicKeys)
    );
    console.log(
      '🚀 ~ useRegisterValidator ~ validatorOperatorIds:',
      JSON.stringify(validatorOperatorIds, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    console.log(
      '🚀 ~ useRegisterValidator ~ validatorSharedKeys:',
      JSON.stringify(validatorSharedKeys)
    );
    console.log(
      '🚀 ~ useRegisterValidator ~ validatorEncryptKeys:',
      JSON.stringify(validatorEncryptKeys)
    );

    if (isBatch) {
      const eachAmount = paySubscriptionFee / BigInt(validators.length);

      return {
        ...networkContract,
        functionName: 'batchRegisterValidator',
        account: address,
        args: [
          validatorPublicKeys,
          validatorOperatorIds[0],
          validatorSharedKeys,
          validatorEncryptKeys,
          validators.length,
          eachAmount,
        ],
      };
    }

    return {
      ...networkContract,
      functionName: 'registerValidator',
      account: address,
      args: [
        validatorPublicKeys[0],
        validatorOperatorIds[0],
        validatorSharedKeys[0],
        validatorEncryptKeys[0],
        paySubscriptionFee,
      ],
    };
  };

  const registerClusterNodeValidator = async (
    validators: IResponseClusterNodeValidatorItem[],
    paySubscriptionFee: bigint
  ) => {
    const contractConfig = prepareClusterNodeContractConfig(validators, paySubscriptionFee);

    const hash = await writeContractAsync(contractConfig as any);

    await client?.waitForTransactionReceipt({
      hash,
    });

    return hash;
  };

  const registerClusterNodeValidatorEstimation = async (
    validators: IResponseClusterNodeValidatorItem[],
    paySubscriptionFee: bigint
  ) => {
    const contractConfig = prepareClusterNodeContractConfig(validators, paySubscriptionFee);

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

  return {
    registerClusterNodeValidator,
    registerClusterNodeValidatorEstimation,
    prepareClusterNodeContractConfig,
  };
};
