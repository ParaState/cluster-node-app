import { erc20Abi } from 'viem';

import { config } from '@/config';
import CSModuleAbi from '@/abis/lido/CSModule.json';
import CSAccountingAbi from '@/abis/lido/CSAccounting.json';
import SafeStakeNetworkV4Abi from '@/abis/SafeStakeNetworkV4';
import SafeStakeRegistryV3Abi from '@/abis/SafeStakeRegistryV3';
import SafeStakeClusterNodeAbi from '@/abis/SafeStakeClusterNode';
import SafeStakeOperatorConfigAbi from '@/abis/SafeStakeOperatorConfig';
// import PermissionlessGateAbi from '@/abis/lido/PermissionlessGate.json';

export const erc20Contract = {
  abi: erc20Abi,
  address: config.contractAddress.token,
} as const;

export const networkContract = {
  abi: SafeStakeNetworkV4Abi,
  address: config.contractAddress.network,
} as const;

export const registryContract = {
  abi: SafeStakeRegistryV3Abi,
  address: config.contractAddress.registry,
} as const;

export const operatorConfigContract = {
  abi: SafeStakeOperatorConfigAbi,
  address: config.contractAddress.operatorConfig,
} as const;

export const clusterNodeContract = {
  abi: SafeStakeClusterNodeAbi,
  address: config.contractAddress.clusterNode,
} as const;

export const csmModuleContract = {
  abi: CSModuleAbi,
  address: config.contractAddress.csmModule,
} as const;

export const csmAccountingContract = {
  abi: CSAccountingAbi,
  address: config.contractAddress.csmAccounting,
} as const;

// export const csmPermissionlessGateContract = {
//   abi: PermissionlessGateAbi,
//   address: config.contractAddress.csmPermissionlessGate,
// } as const;
