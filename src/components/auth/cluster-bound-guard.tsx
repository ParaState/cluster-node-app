import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract';

import { config } from '@/config';
import { useBoolean } from '@/hooks';

import { CenterContainer } from '@/components/common';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  children?: React.ReactNode;
};

export const ClusterBoundGuard = ({ children }: Props) => {
  const { address } = useAccount();
  const router = useRouter();
  const [clusterNode, setClusterNode] = useState<any>();
  const loading = useBoolean(true);
  const { getClusterNode } = useClusterNode();

  useEffect(() => {
    const fetchClusterNode = async () => {
      try {
        const node = await getClusterNode(address!);
        setClusterNode(node);
        loading.onFalse();
      } catch (error) {
        loading.onFalse();
      }
    };

    fetchClusterNode();
  }, [address]);

  if (loading.value) {
    return <LoadingScreen />;
  }

  if (!clusterNode?.isRegistered) {
    return (
      <CenterContainer>
        <Typography variant="h6" mb={2}>
          Please setup your cluster node first
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => {
            router.push(config.routes.setup);
          }}
        >
          Go to Setup
        </Button>
      </CenterContainer>
    );
  }

  return <>{children}</>;
};
