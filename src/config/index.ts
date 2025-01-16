import { CurrentFeeMode } from '@/types';

const explorerUrl = import.meta.env.VITE_EXPLORER_URL;
const networkId = +import.meta.env.VITE_NETWORK_ID;

const launchpadLinkMap = {
  1: 'https://launchpad.ethereum.org/en/',
  17000: 'https://holesky.launchpad.ethereum.org/en/',
};

const etherScanLinkMap = {
  1: 'https://etherscan.io',
  17000: 'https://holesky.etherscan.io',
};

const etherScanLink = etherScanLinkMap[networkId]!;

export const config = {
  clusterNodeApi: import.meta.env.VITE_TARGET_URL,
  // eth network id
  networkId,
  // wallet connect
  projectId: `f5a1d403c1c9d7165e314a74559a4276`,
  // env name
  envName: import.meta.env.VITE_ENV_NAME,
  isDevnet: import.meta.env.VITE_ENV_NAME === 'development',

  OPERATORS: {
    VALID_KEY_LENGTH: 44,
  },
  contractAddress: {
    token: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
    network: import.meta.env.VITE_NETWORK_CONTRACT_ADDRESS,
    registry: import.meta.env.VITE_REGISTRY_CONTRACT_ADDRESS,
    swapDVT: import.meta.env.VITE_SWAP_DVT_CONTRACT_ADDRESS,
    oldToken: import.meta.env.VITE_OLD_TOKEN_CONTRACT_ADDRESS,
    operatorConfig: import.meta.env.VITE_OPERATOR_CONFIG_CONTRACT_ADDRESS,
    clusterNode: import.meta.env.VITE_CLUSTER_NODE_CONTRACT_ADDRESS,
  },

  routes: {
    home: '/',
    dashboard: '/dashboard',
    operator: {
      home: '/operator',
      operator: '/operator/:id',
      getOperator: (id: string) => `/operator/${id}`,
      verify: '/operator/verify',
    },
    validator: {
      home: '/validator',
      create: '/validator/create',
      import: '/validator/import',
      email: '/validator/email',
      selectOperators: '/validator/select-operators',
      depositValidator: '/validator/deposit',
      success: '/validator/success',
      slashingWarning: '/validator/slashing-warning',
      confirm: '/validator/confirm',
      validatorExit: '/validator/exit',
      // goValidatorExit: (pk: string) => `/validator/${pk}/exit`,
    },
  },

  // for external links
  links: {
    docs: `https://github.com/ParaState/SafeStakeOperator`,
    documentation: `https://github.com/ParaState/SafeStakeOperator/blob/main/docs/safestake-running-an-operator-node.md`,
    explorer: explorerUrl,
    validator: (pk: string) => `${explorerUrl}/validators/${pk}`,
    operator: (id: number) => `${explorerUrl}/operators/${id}`,
    notVerifiedLink: 'https://vote.safestake.xyz',
    launchpadLink: launchpadLinkMap[networkId]!,
    etherTxLink: (tx: string) => `${etherScanLink}/tx/${tx}`,
    etherAddressLink: (address: string) => `${etherScanLink}/address/${address}`,
    airdrop: `${explorerUrl}/airdrop`,
    airdropCriteria:
      'https://parastate-safestake-community.notion.site/SafeStake-Mainnet-Validator-Incentive-Program-VIP-2826f3f979604ba68bd8e6062168b1e3',
    referral: (address: string) => `${window.location.origin}/validator?ref=${address}`,
    uniswapLink:
      'https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0x29fa1fee0f4f0ab0e36ef7ab8d7a35439ec6be75',
  },

  GLOBAL_VARIABLE: {
    BLOCKS_PER_DAY: 6840,
    OPERATORS_PER_PAGE: 50,
    BLOCKS_PER_YEAR: 2462400,
    BLOCKS_PER_MONTH: 205200,
    VALIDATORS_PER_OPERATOR_LIMIT: 1,
    NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
  },

  maxKeyStoreFiles: 20,
  maxValidatorCount: 600,
  minimumBlocksValidatorShouldPay: 100,
  maxClaimValidatorCount: 800,
  currentFeeModeBlockMap: {
    [CurrentFeeMode.minimum]: 100,
    [CurrentFeeMode.month]: 205200,
    [CurrentFeeMode.year]: 2462400,
  },
  notVerifiedLink: 'https://vote.safestake.xyz',

  operatorThresholdList: [
    {
      threshold: 3,
      sharesNumber: 4,
    },
    // {
    //   threshold: 5,
    //   sharesNumber: 7,
    // },
  ],
};

export const navConfig = [
  {
    title: 'My Account',
    path: config.routes.dashboard,
    auth: true,
  },
  {
    title: 'Explorer',
    path: config.links.explorer,
    auth: false,
  },
  {
    title: 'Docs',
    path: config.links.docs,
    auth: false,
  },
];

console.log(config);

export const watchingBlockNumberPaths = [config.routes.validator.confirm, config.routes.dashboard];
