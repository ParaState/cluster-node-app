import invariant from 'tiny-invariant';
import { LidoSDKCsm } from '@lidofinance/lido-csm-sdk';
import { useMemo, useEffect, useContext, createContext } from 'react';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import { LidoSDKWrap, LidoSDKStake } from '@lidofinance/lido-ethereum-sdk';
import { LidoSDKstETH, LidoSDKwstETH } from '@lidofinance/lido-ethereum-sdk/erc20';
import { useConfig, useAccount, useSwitchChain, usePublicClient, useWalletClient } from 'wagmi';

import { config } from '@/config';

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  csm: LidoSDKCsm;
};

const chainId = config.networkId;

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

export const LidoSDKProvider = ({ children }: React.PropsWithChildren) => {
  const wagmiConfig = useConfig();
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  // reset internal wagmi state after disconnect
  const { isConnected } = useAccount();

  const clApiUrl = '';

  const { switchChain } = useSwitchChain();
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isConnected) {
      return () => {
        // protecs from side effect double run
        if (!wagmiConfig.state.current) {
          switchChain({
            chainId: config.networkId,
          });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const contextValue = useMemo(() => {
    const core = new LidoSDKCore(
      // @ts-expect-error: typing (viem + LidoSDK)
      {
        chainId,
        // logMode: 'debug',
        rpcProvider: publicClient,
        web3Provider: walletClient,
      },
      'CSM'
    );

    const stake = new LidoSDKStake({ core });
    const stETH = new LidoSDKstETH({ core });
    const wstETH = new LidoSDKwstETH({ core });
    const wrap = new LidoSDKWrap({ core });
    const csm = new LidoSDKCsm({
      core,
      clApiUrl,
    });

    return {
      chainId: core.chainId,
      core,
      stake,
      stETH,
      wstETH,
      wrap,
      csm,
    };
  }, [clApiUrl, publicClient, walletClient]);
  return <LidoSDKContext.Provider value={contextValue}>{children}</LidoSDKContext.Provider>;
};
