import { holesky, mainnet } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { config } from '@/config';

// Get projectId at https://cloud.walletconnect.com

if (!config.projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'SafeStake',
  description: 'SafeStake',
  url: 'https://www.safestake.xyz', // origin must match your domain & subdomain
  icons: ['https://www.safestake.xyz/assets/logo-single.svg'],
};

// Create wagmiConfig
export const wagmiConfig = defaultWagmiConfig({
  chains: config.networkId === mainnet.id ? [mainnet] : [holesky], // required
  // chains: [mainnet, holesky], // required
  projectId: config.projectId, // required
  metadata, // required
  // ssr: true,
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
  // connectors: [
  //   injected(),
  //   walletConnect({ projectId }),
  //   metaMask(),
  // ],
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  // ...wagmiOptions, // Optional - Override createConfig parameters
});
