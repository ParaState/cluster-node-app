const SafeStakeNodeDepositAbi = [
  {
    inputs: [
      {
        internalType: 'contract SafeStakeStorageInterface',
        name: '_safeStakeStorageAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'DepositReceived',
    type: 'event',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minimumNodeFee',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_validatorPubkey',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_validatorSignature',
        type: 'bytes',
      },
      {
        internalType: 'bytes32',
        name: '_depositDataRoot',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_salt',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_expectedMinipoolAddress',
        type: 'address',
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
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'getDepositType',
    outputs: [
      {
        internalType: 'enum MinipoolDeposit',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default SafeStakeNodeDepositAbi;
