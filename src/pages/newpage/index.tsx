// import { randomBytes } from 'crypto';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

import { Box, Grid, Card, Button, Container, Typography } from '@mui/material';

import { useClusterNode } from '@/hooks/contract';

import { getClusterPubkey, setClusterPubkey } from '@/utils/storage-available';

import services from '@/services';

export default function TestClusterPage() {
  const { address } = useAccount();

  const walletClient = useWalletClient();
  console.log('🚀 ~ TestClusterPage ~ walletClient:', walletClient);
  const { enqueueSnackbar } = useSnackbar();

  const { getClusterNode, registerClusterNode } = useClusterNode();

  const [userPubkey, setUserPubkey] = useState('');
  const [userClusterNode, setUserClusterNode] = useState<any>(null);

  // const generatePubkey = async () => {
  //   const randomPubkey = `0x${randomBytes(32).toString('hex')}`;
  //   setUserPubkey(randomPubkey);

  //   setClusterPubkey(address!, randomPubkey);
  // };

  // const handleGetPublicKey = async () => {
  //   const result = await walletClient.data?.request({
  //     method: 'eth_getEncryptionPublicKey' as any,
  //     params: [address!],
  //   });

  //   console.log('🚀 ~ handleGetPublicKey ~ result:', result);

  //   if (result && typeof result === 'string') {
  //     // setClusterPubkey(address!, result!);
  //     setClusterPubkey(
  //       address!,
  //       '0x90e110288503f5d5dd2d355570f5216a36faafd51061c138a37d984af984f19dc6a5014917f6711882c17522c54feedb'
  //     );
  //   }
  //   // https://hackmd.io/@-rwVcOhlT_2XGhvacwiahw/S1jDfBSrkg
  // };

  const getClusterNodeClick = async () => {
    const pubkey = getClusterPubkey(address!);
    if (!pubkey) {
      enqueueSnackbar('Please get public key first', { variant: 'error' });
    }

    const result = await getClusterNode(pubkey!);

    setUserClusterNode(result);
  };

  const registerClusterNodeClick = async () => {
    const pubkey = getClusterPubkey(address!);

    if (!pubkey) {
      enqueueSnackbar('Please get public key first', { variant: 'error' });
    }

    const result = await registerClusterNode(pubkey!);

    console.log('🚀 ~ registerClusterNodeClick ~ result:', result);
  };

  const getInitiatorStatusClick = async () => {
    const result = await services.clusterNode.getInitiatorStatus();

    console.log('🚀 ~ getInitiatorStatusClick ~ result:', result);

    setUserPubkey(result.cluster_pubkey);
    setClusterPubkey(address!, result.cluster_pubkey);
  };

  const bindInitiatorOwnerClick = async () => {
    const result = await services.clusterNode.bindInitiatorOwner(address!);

    console.log('🚀 ~ bindInitiatorOwnerClick ~ result:', result);
  };

  const queryValidatorStatusClick = async () => {
    // const result = await services.clusterNode.queryValidatorStatus(
    //   IResponseValidatorStatusEnum.registered
    // );
    // console.log('🚀 ~ queryValidatorStatusClick ~ result:', result);
  };

  const updateValidatorStatusClick = async () => {};

  useEffect(() => {
    getInitiatorStatusClick();
    if (address) {
      getClusterNodeClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h2"
        mt={{
          xs: 4,
          md: 8,
        }}
        align="center"
      >
        My Account
      </Typography>

      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">DVT Balance</Typography>
              <Typography variant="h3" sx={{ fontSize: 40 }}>
                {123123}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">DVT Balance</Typography>
              <Typography variant="h3" sx={{ fontSize: 40 }}>
                {123123}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container mt={2} spacing={2} gap={2}>
        {/* <Button variant="contained" color="primary" onClick={generatePubkey}>
          {' '}
          generate Pubkey
        </Button> */}

        {/* <Button variant="contained" color="primary" onClick={handleGetPublicKey}>
          {' '}
          get Public key
        </Button> */}

        <Button variant="contained" color="primary" onClick={getClusterNodeClick}>
          {' '}
          getClusterNode
        </Button>

        <Button variant="contained" color="primary" onClick={registerClusterNodeClick}>
          {' '}
          registerClusterNode
        </Button>

        <Button variant="contained" color="primary" onClick={getInitiatorStatusClick}>
          {' '}
          getInitiatorStatus
        </Button>

        <Button variant="contained" color="primary" onClick={bindInitiatorOwnerClick}>
          {' '}
          bindInitiatorOwner
        </Button>

        <Button variant="contained" color="primary" onClick={queryValidatorStatusClick}>
          {' '}
          queryValidatorStatus
        </Button>

        <Button variant="contained" color="primary" onClick={updateValidatorStatusClick}>
          {' '}
          updateValidatorStatus
        </Button>
      </Grid>

      <Grid container mt={2} spacing={2} gap={2}>
        <Grid item md={12}>
          pubkey: {userPubkey && <Typography variant="body2">{userPubkey}</Typography>}
        </Grid>

        <Grid item md={12}>
          clusterNode:{' '}
          {userClusterNode && (
            <Typography variant="body2">{JSON.stringify(userClusterNode)}</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
