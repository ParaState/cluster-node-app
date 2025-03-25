import { hoodi, mainnet } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

import { config } from '@/config';

// Get projectId at https://cloud.walletconnect.com

if (!config.projectId) throw new Error('Project ID is not defined');

export const appkitMetadata = {
  name: 'SafeStake',
  description: 'SafeStake',
  url: 'https://www.safestake.xyz', // origin must match your domain & subdomain
  icons: ['https://www.safestake.xyz/assets/logo-single.svg'],
};

export const wagmiNetworks = config.networkId === mainnet.id ? [mainnet] : [hoodi];

// Create wagmiConfig
export const wagmiAdapter = new WagmiAdapter({
  networks: wagmiNetworks, // required
  projectId: config.projectId, // required
});
