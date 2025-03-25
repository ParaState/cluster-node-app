import { config } from '@/config';

export const NETWORKS = {
  MAINNET: 1,
  ROPSTEN: 3,
  GOERLI: 5,
  HOLESKY: 17000,
  HOODI: 560048,
};

/**
 * If network Id is passed to the function from MetaMask it will be used first
 * Otherwise old behavior
 * @param networkId
 */
export const getBaseBeaconchaUrl = () => {
  switch (config.networkId) {
    case NETWORKS.GOERLI:
      return 'https://prater.beaconcha.in';
    case NETWORKS.MAINNET:
      return 'https://beaconcha.in';
    case NETWORKS.ROPSTEN:
      return 'https://ropsten.beaconcha.in';
    case NETWORKS.HOLESKY:
      return 'https://holesky.beaconcha.in';
    case NETWORKS.HOODI:
      return 'https://hoodi.beaconcha.in';
    default:
      return 'https://beaconcha.in';
  }
};

export const getEtherScanUrl = () => {
  switch (config.networkId) {
    case NETWORKS.GOERLI:
      return 'https://goerli.etherscan.io';
    case NETWORKS.MAINNET:
      return 'https://etherscan.io';
    case NETWORKS.ROPSTEN:
      return 'https://ropsten.etherscan.io';
    case NETWORKS.HOLESKY:
      return 'https://holesky.etherscan.io';
    case NETWORKS.HOODI:
      return 'https://hoodi.etherscan.io';
    default:
      return 'https://etherscan.io';
  }
};
