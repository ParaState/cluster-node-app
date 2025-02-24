import { ReactNode } from 'react';
import { State, WagmiProvider } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from '@/config';
import { wagmiAdapter, wagmiNetworks, appkitMetadata } from '@/wagmi/config';

// Setup queryClient
const queryClient = new QueryClient();

if (!config.projectId) throw new Error('Project ID is not defined');

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: wagmiNetworks as any,
  metadata: appkitMetadata,
  projectId: config.projectId,
  termsConditionsUrl: 'https://www.safestake.xyz/assets/terms-of-use.pdf',
});

export function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
