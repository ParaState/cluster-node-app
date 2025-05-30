const SafeStakeStorageAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldGuardian',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newGuardian',
        type: 'address',
      },
    ],
    name: 'GuardianChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
    ],
    name: 'GuardianInitialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawalAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
    ],
    name: 'NodeWithdrawalAddressSet',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'addUint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'confirmGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddress',
        type: 'address',
      },
    ],
    name: 'confirmWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteBool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteBytes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteInt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteString',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'deleteUint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'r',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getBool',
    outputs: [
      {
        internalType: 'bool',
        name: 'r',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getBytes',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getBytes32',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDeployedStatus',
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
    name: 'getGuardian',
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
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getInt',
    outputs: [
      {
        internalType: 'int256',
        name: 'r',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddress',
        type: 'address',
      },
    ],
    name: 'getNodePendingWithdrawalAddress',
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
        internalType: 'address',
        name: '_nodeAddress',
        type: 'address',
      },
    ],
    name: 'getNodeWithdrawalAddress',
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
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getString',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getUint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'r',
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
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: '_value',
        type: 'address',
      },
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: '_value',
        type: 'bool',
      },
    ],
    name: 'setBool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_value',
        type: 'bytes',
      },
    ],
    name: 'setBytes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_value',
        type: 'bytes32',
      },
    ],
    name: 'setBytes32',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setDeployedStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newAddress',
        type: 'address',
      },
    ],
    name: 'setGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'int256',
        name: '_value',
        type: 'int256',
      },
    ],
    name: 'setInt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'string',
        name: '_value',
        type: 'string',
      },
    ],
    name: 'setString',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'setUint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_newWithdrawalAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_confirm',
        type: 'bool',
      },
    ],
    name: 'setWithdrawalAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_key',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'subUint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default SafeStakeStorageAbi;
