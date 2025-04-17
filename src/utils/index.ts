export * from './calc';
export * from './auth';
export * from './axios';
export * from './format';
export * from './string';
export * from './beaconcha';
export * from './format-time';
export * from './format-number';
export * from './storage-available';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
