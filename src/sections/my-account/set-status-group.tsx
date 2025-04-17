import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import services from '@/services';
import { useBoolean } from '@/hooks';
import { IRequestValidatorActionEnum, IResponseClusterNodeValidatorItem } from '@/types';

type Props = {
  clusterValidatorQuery: UseQueryResult<IResponseClusterNodeValidatorItem[], Error>;
  selectedRow: IResponseClusterNodeValidatorItem[];
};

export function SetStatusGroup({ clusterValidatorQuery, selectedRow }: Props) {
  const runValidatorLoading = useBoolean();

  return (
    <Stack direction="row" px={2} pt={2} pb={1} spacing={1}>
      <LoadingButton
        component="span"
        variant="soft"
        color="inherit"
        disabled={selectedRow.length === 0}
        onClick={async () => {
          services.clusterNode.updateValidatorStatus(
            selectedRow.map((v) => ({
              pubkey: v.pubkey,
              action: IRequestValidatorActionEnum.ready,
              txid: v.generate_txid || '',
            }))
          );
          await clusterValidatorQuery.refetch();
        }}
        loading={runValidatorLoading.value}
      >
        Set Ready Status
      </LoadingButton>

      <LoadingButton
        component="span"
        variant="soft"
        color="inherit"
        disabled={selectedRow.length === 0}
        onClick={async () => {
          services.clusterNode.updateValidatorStatus(
            selectedRow.map((v) => ({
              pubkey: v.pubkey,
              action: IRequestValidatorActionEnum.register,
              txid: v.register_txid || '',
            }))
          );
          await clusterValidatorQuery.refetch();
        }}
        loading={runValidatorLoading.value}
      >
        Set Register Status
      </LoadingButton>

      <LoadingButton
        component="span"
        variant="soft"
        color="inherit"
        disabled={selectedRow.length === 0}
        onClick={async () => {
          services.clusterNode.updateValidatorStatus(
            selectedRow.map((v) => ({
              pubkey: v.pubkey,
              action: IRequestValidatorActionEnum.deposit,
              txid: v.exit_txid || '',
            }))
          );
          await clusterValidatorQuery.refetch();
        }}
        loading={runValidatorLoading.value}
      >
        Set Deposit Status
      </LoadingButton>

      <LoadingButton
        component="span"
        variant="soft"
        color="inherit"
        disabled={selectedRow.length === 0}
        onClick={async () => {
          services.clusterNode.updateValidatorStatus(
            selectedRow.map((v) => ({
              pubkey: v.pubkey,
              action: IRequestValidatorActionEnum.exit,
              txid: v.exit_txid || '',
            }))
          );
          await clusterValidatorQuery.refetch();
        }}
        loading={runValidatorLoading.value}
      >
        Set Exit Status
      </LoadingButton>
    </Stack>
  );
}
