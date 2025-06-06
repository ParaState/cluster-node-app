const SafeStakeNetworkV4Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'claimed',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'penalty',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'AccountClaim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'senderAddress',
        type: 'address',
      },
    ],
    name: 'FundsDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
    ],
    name: 'FundsWithdrawal',
    type: 'event',
  },
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
        internalType: 'uint256',
        name: 'oldFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'NetworkFeeUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'NetworkFeesWithdrawal',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'id',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    name: 'OperatorRegistration',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'operatorFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'payAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startBlockNumber',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endBlockNumber',
        type: 'uint256',
      },
    ],
    name: 'OperatorTaskDetail',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'uint32[]',
        name: 'operatorIds',
        type: 'uint32[]',
      },
      {
        indexed: false,
        internalType: 'bytes[]',
        name: 'sharesPublicKeys',
        type: 'bytes[]',
      },
      {
        indexed: false,
        internalType: 'bytes[]',
        name: 'encryptedKeys',
        type: 'bytes[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paidBlockNumber',
        type: 'uint256',
      },
    ],
    name: 'ValidatorRegistration',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
    ],
    name: 'ValidatorRemoval',
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
    name: 'MANAGING_OPERATORS_PER_ACCOUNT_LIMIT',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
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
    name: '_SafeStakeRegistryContract',
    outputs: [
      {
        internalType: 'contract ISafeStakeRegistryV3',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'operatorIds',
        type: 'uint32[]',
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
    ],
    name: '_checkDepositAmount',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_claimNonce',
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
        name: '',
        type: 'address',
      },
    ],
    name: '_disbaledOwner',
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
    inputs: [],
    name: '_minimumBlocksValidatorPay',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
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
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_operatorInDatas',
    outputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'indexInData',
        type: 'uint256',
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
    name: '_operatorInUse',
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
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    name: '_operators',
    outputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastBlockNumber',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'enable',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_token',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
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
    name: '_validatorDatas',
    outputs: [
      {
        internalType: 'uint256',
        name: 'startBlockNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endBlockNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastOperatorFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'enable',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'operatorIds',
        type: 'uint32[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'penalties',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'claimBlockNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'accountClaimFee',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'bytes[]',
        name: 'publicKeys',
        type: 'bytes[]',
      },
      {
        internalType: 'uint32[]',
        name: 'operatorIds',
        type: 'uint32[]',
      },
      {
        internalType: 'bytes[][]',
        name: 'sharesPublicKeys',
        type: 'bytes[][]',
      },
      {
        internalType: 'bytes[][]',
        name: 'sharesEncrypteds',
        type: 'bytes[][]',
      },
      {
        internalType: 'uint32',
        name: 'validatorCount',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'eachAmount',
        type: 'uint256',
      },
    ],
    name: 'batchRegisterValidator',
    outputs: [],
    stateMutability: 'payable',
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
        internalType: 'bytes[]',
        name: 'publickeys',
        type: 'bytes[]',
      },
      {
        internalType: 'uint256[]',
        name: 'eachamounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'totalamount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'getOperatorEarningsById',
    outputs: [
      {
        internalType: 'uint256',
        name: 'earnings',
        type: 'uint256',
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
    ],
    name: 'getOperatorEarningsByOwner',
    outputs: [
      {
        internalType: 'uint256',
        name: 'earnings',
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
        name: 'operatorId',
        type: 'uint32',
      },
    ],
    name: 'getValidatorCountInOperator',
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
        internalType: 'contract ISafeStakeRegistryV3',
        name: 'registryAddress_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token_',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'minimumBlocksValidatorPay_',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_operatorFee',
        type: 'uint64',
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
        internalType: 'bool',
        name: 'withNetworkFee',
        type: 'bool',
      },
    ],
    name: 'operatorFee',
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
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
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
        name: 'owner',
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
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'registerValidator',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'publicKeys',
        type: 'bytes[]',
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
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'replaceValidator',
    outputs: [],
    stateMutability: 'payable',
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
    inputs: [],
    name: 'self',
    outputs: [
      {
        internalType: 'uint256',
        name: 'networkFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'networkEarnings',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'networkClaimed',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'networkPenalty',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address',
      },
    ],
    name: 'setWhiteAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'splitSignature',
    outputs: [
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
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
        name: 'newMinimumBlocksValidatorPay',
        type: 'uint64',
      },
    ],
    name: 'updateMinimumBlocksValidatorPay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'updateNetworkFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'updateTokenAddr',
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
  {
    inputs: [],
    name: 'whitelist',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawNetworkEarnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;

export default SafeStakeNetworkV4Abi;
