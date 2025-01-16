export function localStorageAvailable() {
  try {
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function localStorageGetItem(key: string, defaultValue = '') {
  const storageAvailable = localStorageAvailable();

  let value;

  if (storageAvailable) {
    value = localStorage.getItem(key) || defaultValue;
  }

  return value;
}

export function setClusterPubkey(address: string, pubkey: string) {
  localStorage.setItem(`pubkey-${address}`, pubkey);
}

export function getClusterPubkey(address: string) {
  console.log(`pubkey-${address}`);
  return localStorage.getItem(`pubkey-${address}`) || '';
}
