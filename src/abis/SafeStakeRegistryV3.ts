const SafeStakeRegistryV3Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint32',
        name: 'operatorId',
        type: 'uint32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'OperatorRemoval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'fromDao',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'verified',
        type: 'bool',
      },
    ],
    name: 'OperatorVerified',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NODE_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REGISTERED_OPERATORS_PER_ACCOUNT_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SIGNER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VALIDATORS_PER_OPERATOR_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_activeValidatorCount',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_lastInitiatorId',
    outputs: [
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_lastOperatorId',
    outputs: [
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_operatorFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    name: '_operators',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'indexInOwner',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'validatorCount',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'fromParaStateDao',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'verified',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_operatorsByOwnerAddress',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: '_operatorsByPublicKeys',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_owners',
    outputs: [
      {
        internalType: 'uint32',
        name: 'activeValidatorCount',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'validatorsDisabled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: '_validators',
    outputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'indexInOwner',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'len',
        type: 'uint256',
      },
    ],
    name: 'checkOperatorsLength',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'checkRole',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'disableOwnerValidators',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'enableOwnerValidators',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'operatorFee',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'isAccountRegisteredOperator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'isAccountRegisteredValidator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    name: 'isValidatorOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'operatorId',
        type: 'uint32',
      },
    ],
    name: 'operator_detail',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'uint32',
        name: 'activeValidatorCount',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'validatorsDisabled',
        type: 'bool',
      },
      {
        internalType: 'bytes[]',
        name: 'validators',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    name: 'registerOperator',
    outputs: [
      {
        internalType: 'uint32',
        name: 'operatorId',
        type: 'uint32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
      {
        internalType: 'uint32[]',
        name: 'operatorIds',
        type: 'uint32[]',
      },
      {
        internalType: 'bytes[]',
        name: 'sharesPublicKeys',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes[]',
        name: 'sharesEncrypted',
        type: 'bytes[]',
      },
    ],
    name: 'registerValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'operatorId',
        type: 'uint32',
      },
    ],
    name: 'removeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    name: 'removeValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'fee',
        type: 'uint64',
      },
    ],
    name: 'updateOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'pubkey',
        type: 'bytes',
      },
    ],
    name: 'validatorOf',
    outputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'uint32[]',
        name: 'operatorsIds',
        type: 'uint32[]',
      },
      {
        internalType: 'uint32',
        name: 'indexInOwner',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'fromDao',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'verified',
        type: 'bool',
      },
    ],
    name: 'verifyOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const;
export default SafeStakeRegistryV3Abi;
