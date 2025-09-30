import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract';

import { config } from '@/config';
import services from '@/services';
import { useBoolean } from '@/hooks';
import { IResponseInitiatorStatus, IResponseInitiatorStatusEnum } from '@/types';

import { CenterContainer } from '@/components/common';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  children?: React.ReactNode;
};

export const ClusterBoundGuard = ({ children }: Props) => {
  const { address } = useAccount();
  const router = useRouter();
  const [clusterNode, setClusterNode] = useState<any>();
  const [initiator, setInitiator] = useState<IResponseInitiatorStatus>();
  const loading = useBoolean(true);
  const { getClusterNode } = useClusterNode();

  useEffect(() => {
    const fetchClusterNode = async () => {
      try {
        const result = await services.clusterNode.getInitiatorStatus();
        setInitiator(result);
        const node = await getClusterNode(result.cluster_pubkey);
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

  if (!clusterNode?.isRegistered && initiator?.status === IResponseInitiatorStatusEnum.completed) {
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
