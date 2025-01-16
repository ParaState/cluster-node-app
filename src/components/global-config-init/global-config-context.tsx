// import { atom, useAtom } from 'jotai';

// import { CurrentFeeMode } from '@/types';
// import { useReadContract } from 'wagmi';
// import { networkContract } from '@/config/contract';

// const operatorFeeWithNetworkFeeAtom = atom(0n);

// const subscriptionFeeMapAtom = atom<Record<string, bigint>>({
//   [CurrentFeeMode.minimum]: BigInt(0),
//   [CurrentFeeMode.month]: BigInt(0),
//   [CurrentFeeMode.year]: BigInt(0),
// });

// export function useGlobalConfig() {
//   const [operatorFeeWithNetworkFee, setOperatorFeeWithNetworkFee] = useAtom(
//     operatorFeeWithNetworkFeeAtom
//   );
//   const [, setSubscriptionFeeMap] = useAtom(subscriptionFeeMapAtom);

//   // console.log(pk);
//   const result = useReadContract({
//     ...networkContract,
//     functionName: 'operatorFee',
//     args: [true],
//   });

// }

export {};
