export const updateSignatureHeader = (signature: string, owner: string, deadline: string) => {
  localStorage.setItem('v-signature', signature);
  localStorage.setItem('v-owner', owner);
  localStorage.setItem('v-deadline', deadline);
};

export const clearSignatureHeader = () => {
  localStorage.removeItem('v-signature');
  localStorage.removeItem('v-owner');
  localStorage.removeItem('v-deadline');
};

export const getSignatureHeader = () => {
  return {
    'v-signature': localStorage.getItem('v-signature'),
    'v-owner': localStorage.getItem('v-owner'),
    'v-deadline': localStorage.getItem('v-deadline'),
  };
};

export const isVerifiedSignature = () => {
  const { 'v-deadline': deadline, 'v-signature': signature } = getSignatureHeader();

  if (!deadline || !signature) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const deadlineTimestamp = parseInt(deadline, 10);
  return now < deadlineTimestamp;
};
