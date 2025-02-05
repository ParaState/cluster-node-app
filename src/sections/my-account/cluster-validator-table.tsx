import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { UseQueryResult } from '@tanstack/react-query';

import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  TableRow,
  useTheme,
  MenuItem,
  Skeleton,
  TableBody,
  TableCell,
  CardHeader,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useRemoveValidator, useFeeReceiptAddress } from '@/hooks/contract';

import { isAddressZero, longStringShorten } from '@/utils/string';

import { config } from '@/config';
import { useBoolean } from '@/hooks';
import { formatTimestamp } from '@/utils';
import { useSelectedOperators } from '@/stores';
import {
  IResponseValidatorItem,
  IRequestCommonPagination,
  IResponseClusterNodeValidatorItem,
} from '@/types';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CopyButton from '@/components/copy-button';
import { useSnackbar } from '@/components/snackbar';
import { TableHeadCustom } from '@/components/table';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import SimpleTableSkeleton from '@/components/table/simple-table-skeleton';

type Props = {
  clusterValidatorQuery: UseQueryResult<IResponseClusterNodeValidatorItem[], Error>;
  pagination: IRequestCommonPagination;
  setPagination: (pagination: IRequestCommonPagination) => void;
  onPaginationChange?: (pagination: IRequestCommonPagination) => void;
  hideAction?: boolean;
  address: string;
};

export function ClusterValidatorTable({
  clusterValidatorQuery,
  pagination,
  setPagination,
  onPaginationChange,
  hideAction,
  address,
}: Props) {
  const router = useRouter();

  const { getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);

  const removeLoading = useBoolean();

  const { removeValidator } = useRemoveValidator();

  const { enqueueSnackbar } = useSnackbar();

  const { resetAll } = useSelectedOperators();

  const theme = useTheme();

  const { data: hash } = useWriteContract();

  const popover = usePopover();

  const [selectedRow, setSelectedRow] = useState<IResponseValidatorItem[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    // setPagination({ offset: newPage, limit: pagination!.limit });
    onPaginationChange?.({ offset: newPage, limit: pagination.limit });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({ offset: 0, limit: +event.target.value });
  };

  const removeValidatorClick = async () => {
    const pks = selectedRow.map((row) => row.pk);
    if (pks.length === 0) {
      enqueueSnackbar('Please select at least one validator', { variant: 'warning' });
      return;
    }

    removeLoading.onTrue();

    try {
      await removeValidator(pks);
      await clusterValidatorQuery.refetch();
      setSelectedRow([]);
      enqueueSnackbar('Remove validator success', { variant: 'success' });
      console.log(hash);
    } catch (error) {
      enqueueSnackbar(error.details || error.message, { variant: 'error' });
      console.log('🚀 ~ removeValidator ~ error:', error);
      console.log(error);
    } finally {
      removeLoading.onFalse();
    }
  };

  return (
    <Card>
      <CardHeader
        title="Cluster validators"
        color="text.primary"
        sx={{ px: 2 }}
        action={
          <IconButton color="inherit" onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
      />
      {/* <Stack direction="row" px={1} py={1} spacing={1}>
        {!hideAction && (
          <LoadingButton
            variant="soft"
            color="inherit"
            loading={removeLoading.value}
            onClick={() => removeValidatorClick()}
            disabled={selectedRow.length === 0}
          >
            Remove Validator
          </LoadingButton>
        )}
      </Stack> */}

      {false && (
        <Box sx={{ p: 2 }}>
          {getFeeRecipientAddressQuery.isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={22} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Fee Recipient Address: &nbsp;
              <Typography variant="body2" color="text.primary" display="inline" component="span">
                {isAddressZero(getFeeRecipientAddressQuery.data)
                  ? address
                  : getFeeRecipientAddressQuery.data}
              </Typography>
            </Typography>
          )}
        </Box>
      )}

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem
          onClick={() => {
            resetAll();
            router.push(config.routes.validator.validatorExit);
          }}
        >
          <Iconify width={24} icon="iconamoon:exit-bold" color={theme.palette.grey[600]} />
          Validator Exit
        </MenuItem>
      </CustomPopover>

      <TableContainer>
        <Scrollbar>
          <Table>
            <TableHeadCustom
              headLabel={[
                { id: 'id', label: 'Public Key', align: 'left' },
                { id: 'status', label: 'Status', align: 'center' },
                { id: 'created_at', label: 'Created At', align: 'center' },
              ]}
              rowCount={clusterValidatorQuery.data?.length || 0}
              numSelected={selectedRow.length}
              // onSelectAllRows={
              //   !hideAction
              //     ? (checked) => {
              //         if (checked) {
              //           setSelectedRow(clusterValidatorQuery.data?.rows || []);
              //         } else {
              //           setSelectedRow([]);
              //         }
              //       }
              //     : undefined
              // }
            />

            <TableBody>
              {clusterValidatorQuery.isLoading && <SimpleTableSkeleton skeletonCounter={10} />}
              {clusterValidatorQuery.data?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="left">
                    <Stack direction="row" alignItems="center">
                      <Link
                        href={`${config.links.validator(row.pubkey)}`}
                        target="_blank"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {longStringShorten(row.pubkey)}
                      </Link>
                      <CopyButton text={row.pubkey} />
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Label variant="soft" color="info">
                      {row.status}
                    </Label>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(row.created_at)}
                    </Typography>
                  </TableCell>

                  {/* <TableCell
                      align="center"
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
                    >
                      <Tooltip title="Remove validator" placement="top">
                        <LoadingButton
                          // loading={currentRemoveValidator.current === row.pk}
                          loadingPosition="start"
                          // onClick={() => removeValidatorClick(row.pk)}
                          sx={{ '& .MuiButton-startIcon': { mr: 0 } }}
                          startIcon={
                            <Iconify
                              sx={{ mr: 0 }}
                              width={24}
                              icon="material-symbols:delete-outline"
                              color={theme.palette.grey[600]}
                            />
                          }
                        />
                      </Tooltip>

                      <Tooltip title="Validator exit" placement="top">
                        <LoadingButton
                          onClick={() =>
                            // router.push(config.routes.validator.goValidatorExit(row.pk))
                            router.push(config.routes.validator.validatorExit)
                          }
                          sx={{ '& .MuiButton-startIcon': { mr: 0 } }}
                          startIcon={
                            <Iconify
                              width={24}
                              icon="iconamoon:exit-bold"
                              color={theme.palette.grey[600]}
                            />
                          }
                        />
                      </Tooltip>
                    </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* {!clusterValidatorQuery.isLoading && (
        <TablePaginationCustom
          count={clusterValidatorQuery.data?.length || 0}
          page={pagination.offset}
          rowsPerPage={pagination.limit}
          // rowsPerPageOptions={[]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          dense={false}
          showFirstButton
          showLastButton
        />
      )} */}
    </Card>
  );
}
