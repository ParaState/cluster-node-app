import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

import { Button, Typography } from '@mui/material';

import { useRouter } from '@/routes/hooks';

import services from '@/services';
import { config } from '@/config';
import { useBoolean } from '@/hooks';
import { IResponseInitiatorStatus, IResponseInitiatorStatusEnum } from '@/types';

import { CenterContainer } from '@/components/common';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  children?: React.ReactNode;
};

const InitiatorBoundGuard = ({ children }: Props) => {
  const { address } = useAccount();
  const router = useRouter();
  const [initiatorStatus, setInitiatorStatus] = useState<IResponseInitiatorStatus>();
  const loading = useBoolean(true);

  useEffect(() => {
    const getInitiatorStatus = async () => {
      try {
        const result = await services.clusterNode.getInitiatorStatus();
        setInitiatorStatus(result);
        loading.onFalse();
      } catch (error) {
        loading.onFalse();
      }
    };

    getInitiatorStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading.value) {
    return <LoadingScreen />;
  }

  if (initiatorStatus?.status !== IResponseInitiatorStatusEnum.completed) {
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

  if (initiatorStatus?.owner !== address) {
    return (
      <CenterContainer>
        <Typography variant="h6" mb={2}>
          You are not the owner of the initiator,
          <br />
          current owner: {initiatorStatus?.owner}
        </Typography>
      </CenterContainer>
    );
  }

  return <>{children}</>;
};

export default InitiatorBoundGuard;
