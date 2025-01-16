import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { UseQueryResult } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  TableRow,
  useTheme,
  Checkbox,
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
import { useSelectedOperators } from '@/stores';
import { IResponseValidators, IResponseValidatorItem, IRequestCommonPagination } from '@/types';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CopyButton from '@/components/copy-button';
import { useSnackbar } from '@/components/snackbar';
import { CommonStatusLabel } from '@/components/common';
import { OperatorLinksList } from '@/components/operator';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import SimpleTableSkeleton from '@/components/table/simple-table-skeleton';
import { TableHeadCustom, TablePaginationCustom } from '@/components/table';
import { SubscriptionEstimateFeePaid } from '@/components/subscription-fee-paid';

import { ValidatorSetFeeReceiptDialog } from '@/sections/my-account/validator-set-fee-receipt-dialog';

type Props = {
  validatorQuery: UseQueryResult<IResponseValidators, Error>;
  pagination: IRequestCommonPagination;
  setPagination: (pagination: IRequestCommonPagination) => void;
  onPaginationChange?: (pagination: IRequestCommonPagination) => void;
  hideAction?: boolean;
  address: string;
};

export function OwnedValidatorTable({
  validatorQuery,
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

  const { value: dialogOpen, ...setDialogOpen } = useBoolean(false);

  const removeValidatorClick = async () => {
    const pks = selectedRow.map((row) => row.pk);
    if (pks.length === 0) {
      enqueueSnackbar('Please select at least one validator', { variant: 'warning' });
      return;
    }

    removeLoading.onTrue();

    try {
      await removeValidator(pks);
      await validatorQuery.refetch();
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

  const setFeeReceiptAddressClick = async () => {
    // const pks = selectedRow.map((row) => row.pk);
    // if (pks.length === 0) {
    //   enqueueSnackbar('Please select at least one validator', { variant: 'warning' });
    //   return;
    // }

    // setFeeReceiptAddressLoading.onTrue();
    setDialogOpen.onTrue();
  };

  return (
    <Card>
      <CardHeader
        title="Owned validators"
        color="text.primary"
        sx={{ px: 2 }}
        action={
          <IconButton color="inherit" onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
      />
      <Stack direction="row" px={1} py={1} spacing={1}>
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

        {!hideAction && (
          <LoadingButton
            variant="soft"
            color="inherit"
            onClick={() => setFeeReceiptAddressClick()}
            // disabled={selectedRow.length === 0}
          >
            Set fee recipient address
          </LoadingButton>
        )}
      </Stack>

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
                { id: 'paid', label: 'Subscription Fee Paid' },
                { id: 'operators', label: 'Operators', align: 'left' },
                { id: 'links', label: '', align: 'center' },
              ]}
              rowCount={validatorQuery.data?.count || 0}
              numSelected={selectedRow.length}
              onSelectAllRows={
                !hideAction
                  ? (checked) => {
                      if (checked) {
                        setSelectedRow(validatorQuery.data?.rows || []);
                      } else {
                        setSelectedRow([]);
                      }
                    }
                  : undefined
              }
            />

            <TableBody>
              {validatorQuery.isLoading && <SimpleTableSkeleton skeletonCounter={10} />}
              {validatorQuery.data?.rows.map((row, index) => (
                <TableRow key={index}>
                  {!hideAction && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRow.includes(row)}
                        onClick={() => {
                          setSelectedRow((prev) =>
                            prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
                          );
                        }}
                      />
                    </TableCell>
                  )}

                  <TableCell align="left">
                    <Stack direction="row" alignItems="center">
                      <Link href={`${config.links.validator(row.pk)}`} target="_blank">
                        {longStringShorten(row.pk)}
                      </Link>
                      <CopyButton text={row.pk} />
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <CommonStatusLabel status={row.status} />
                  </TableCell>

                  <TableCell align="center">
                    <SubscriptionEstimateFeePaid paid={row.paid} />
                  </TableCell>

                  <TableCell align="left">
                    <OperatorLinksList operators={row.operators} />
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

      {!validatorQuery.isLoading && (
        <TablePaginationCustom
          count={validatorQuery.data!.count}
          page={pagination.offset}
          rowsPerPage={pagination.limit}
          // rowsPerPageOptions={[]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          dense={false}
          showFirstButton
          showLastButton
        />
      )}
      {/* {dialogOpen && ( */}
      <ValidatorSetFeeReceiptDialog
        pks={selectedRow.map((row) => row.pk)}
        dialogOpen={dialogOpen}
        onClose={setDialogOpen.onFalse}
      />
      {/* )} */}
    </Card>
  );
}
