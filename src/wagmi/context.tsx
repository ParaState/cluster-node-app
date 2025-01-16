import React, { ReactNode } from 'react';
import { State, WagmiProvider } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from '@/config';
import { wagmiConfig } from '@/wagmi/config';

// Setup queryClient
const queryClient = new QueryClient();

if (!config.projectId) throw new Error('Project ID is not defined');

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId: config.projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  termsConditionsUrl: 'https://www.safestake.xyz/assets/terms-of-use.pdf',
  privacyPolicyUrl: 'https://www.safestake.xyz/assets/privacy-policy.pdf',
});

export function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
