import { CurrentFeeMode, IResponseValidatorStatusEnum } from '@/types';

const explorerUrl = import.meta.env.VITE_EXPLORER_URL;
const networkId = +import.meta.env.VITE_NETWORK_ID;

const launchpadLinkMap = {
  1: 'https://launchpad.ethereum.org/en/',
  17000: 'https://holesky.launchpad.ethereum.org/en/',
  560048: 'https://hoodi.launchpad.ethereum.org/en/',
};

const etherScanLinkMap = {
  1: 'https://etherscan.io',
  17000: 'https://holesky.etherscan.io',
  560048: 'https://hoodi.etherscan.io',
};

const etherScanLink = etherScanLinkMap[networkId]!;

export const config = {
  clusterNodeApi: import.meta.env.VITE_TARGET_URL,
  // eth network id
  networkId,
  // wallet connect
  projectId: `a62cdc83b24414033cb932992dc7b0b6`,
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
    operatorConfig: import.meta.env.VITE_OPERATOR_CONFIG_CONTRACT_ADDRESS,
    clusterNode: import.meta.env.VITE_CLUSTER_NODE_CONTRACT_ADDRESS,
    csmModule: import.meta.env.VITE_CSM_MODULE_CONTRACT_ADDRESS,
    csmAccounting: import.meta.env.VITE_CSM_ACCOUNTING_CONTRACT_ADDRESS,
    lidoWithdrawalAddress: import.meta.env.VITE_LIDO_WITHDRAWAL_ADDRESS,
    lidoFeeRecipient: import.meta.env.VITE_LIDO_FEE_RECIPIENT_ADDRESS,
  },

  routes: {
    home: '/',
    setup: '/setup',
    dashboard: '/dashboard',
    operator: {
      home: '/operator',
      operator: '/operator/:id',
      getOperator: (id: string) => `/operator/${id}`,
      verify: '/operator/verify',
    },
    clusterValidator: {
      home: '/cluster-validator',
      status: '/cluster-validator/:status',
      run: `/cluster-validator/${IResponseValidatorStatusEnum.ready}`,
      activate: `/cluster-validator/${IResponseValidatorStatusEnum.registered}`,
      deposit: `/cluster-validator/${IResponseValidatorStatusEnum.deposited}`,
      exit: `/cluster-validator/${IResponseValidatorStatusEnum.exited}`,
    },
    validator: {
      home: '/validator',
      create: '/validator/create',
      import: '/validator/import',
      email: '/validator/email',
      selectOperators: '/validator/select-operators',
      depositValidator: '/validator/deposit',
      success: '/validator/success',
      sync: '/validator/sync',
      slashingWarning: '/validator/slashing-warning',
      validatorRegistrationNetwork: '/validator/registration-network',
      validatorExit: '/validator/exit',
      validatorGenerateConfirm: '/validator/generate-confirm',
      validatorPollingTx: '/validator/polling-tx/:txid',
      getValidatorPollingTx: (txid) => `/validator/polling-tx/${txid}`,
      lidoCsmRegistration: '/validator/lido-csm-registration',
      // goValidatorExit: (pk: string) => `/validator/${pk}/exit`,
    },
  },

  // for external links
  links: {
    lidoCsm:
      'https://operatorportal.lido.fi/modules/community-staking-module#block-d8e94f551b2e47029a54e6cedea914a7',
    lidoCsmHome: `https://operatorportal.lido.fi/modules/community-staking-module`,
    lidoFeeRecipient: `https://operatorportal.lido.fi/modules/community-staking-module#block-c72daec1bac741d596d88ab82d2e2041`,
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
  // {
  //   title: 'Generate',
  //   path: config.routes.validator.selectOperators,
  // },
  {
    title: 'Validators',
    path: config.routes.clusterValidator.home,
    auth: true,
    children: [
      {
        title: 'Generate',
        path: config.routes.validator.selectOperators,
      },
      {
        title: 'Run',
        path: config.routes.clusterValidator.run,
      },
      {
        title: 'Activate',
        path: config.routes.clusterValidator.activate,
      },
      {
        title: 'Exit',
        path: config.routes.clusterValidator.deposit,
      },
    ],
  },

  // {
  //   title: 'Docs',
  //   path: config.links.docs,
  //   auth: false,
  // },
  {
    title: 'Setup',
    path: config.routes.setup,
    auth: true,
  },
  {
    title: 'Explorer',
    path: config.links.explorer,
    auth: false,
  },
];

// console.log(config);
