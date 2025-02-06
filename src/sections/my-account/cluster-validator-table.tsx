import { useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  Dialog,
  Button,
  TableRow,
  useTheme,
  MenuItem,
  Skeleton,
  Checkbox,
  TableBody,
  TableCell,
  CardHeader,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useFeeReceiptAddress } from '@/hooks/contract';

import { isAddressZero, longStringShorten } from '@/utils/string';

import { config } from '@/config';
import { useBoolean } from '@/hooks';
import { formatTimestamp } from '@/utils';
import { useSelectedOperators } from '@/stores';
import { IRequestCommonPagination, IResponseClusterNodeValidatorItem } from '@/types';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CopyButton from '@/components/copy-button';
import { useSnackbar } from '@/components/snackbar';
import { TableNoData, TableHeadCustom } from '@/components/table';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import SimpleTableSkeleton from '@/components/table/simple-table-skeleton';

type Props = {
  clusterValidatorQuery: UseQueryResult<IResponseClusterNodeValidatorItem[], Error>;
  pagination: IRequestCommonPagination;
  setPagination: (pagination: IRequestCommonPagination) => void;
  onPaginationChange?: (pagination: IRequestCommonPagination) => void;
  address: string;
};

export function ClusterValidatorTable({
  clusterValidatorQuery,
  pagination,
  setPagination,
  onPaginationChange,
  address,
}: Props) {
  const router = useRouter();

  const { getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);

  const removeLoading = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { resetAll } = useSelectedOperators();

  const theme = useTheme();

  const popover = usePopover();

  const { value: dialogOpen, ...setDialogOpen } = useBoolean(false);

  const [selectedRow, setSelectedRow] = useState<IResponseClusterNodeValidatorItem[]>([]);

  const viewValidatorClick = async () => {
    setDialogOpen.onTrue();
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
      <Stack direction="row" px={1} py={1} spacing={1}>
        <LoadingButton
          variant="soft"
          color="inherit"
          loading={removeLoading.value}
          onClick={() => viewValidatorClick()}
          disabled={selectedRow.length === 0}
        >
          View Deposit Data
        </LoadingButton>

        <LoadingButton
          variant="soft"
          color="inherit"
          onClick={() => {
            router.push(config.routes.setup);
          }}
        >
          Generate Validator
        </LoadingButton>
      </Stack>

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

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <TableHeadCustom
              headLabel={[
                { id: 'id', label: 'Public Key', align: 'left' },
                { id: 'owner', label: 'Owner', align: 'left' },
                { id: 'status', label: 'Status', align: 'center' },
                { id: 'created_at', label: 'Created At', align: 'center' },
              ]}
              rowCount={clusterValidatorQuery.data?.length || 0}
              numSelected={selectedRow.length}
              onSelectAllRows={(checked) => {
                if (checked) {
                  setSelectedRow(clusterValidatorQuery.data || []);
                } else {
                  setSelectedRow([]);
                }
              }}
            />

            <TableBody>
              {clusterValidatorQuery.isLoading && <SimpleTableSkeleton skeletonCounter={10} />}
              {clusterValidatorQuery.data?.map((row, index) => (
                <TableRow key={index}>
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

                  <TableCell align="left">
                    <Typography variant="body2" color="text.secondary">
                      {longStringShorten(row.owner)}
                    </Typography>
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

              {clusterValidatorQuery.data?.length === 0 && <TableNoData />}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Dialog fullWidth maxWidth="md" open={dialogOpen} onClose={() => setDialogOpen.onFalse()}>
        <DialogTitle>Deposit Data</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <pre style={{ overflow: 'auto' }}>
              {JSON.stringify(
                selectedRow.map((row) => JSON.parse(row.deposit_data)),
                null,
                2
              )}
            </pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen.onFalse()}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(
                  selectedRow.map((row) => JSON.parse(row.deposit_data)),
                  null,
                  2
                )
              );
              enqueueSnackbar('Copied to clipboard');
            }}
          >
            Copy to Clipboard
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              const jsonContent = JSON.stringify(
                selectedRow.map((row) => JSON.parse(row.deposit_data)),
                null,
                2
              );
              const blob = new Blob([jsonContent], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `deposit_data_${Date.now()}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              enqueueSnackbar('Downloaded deposit data');
            }}
          >
            Download JSON
          </Button>
        </DialogActions>
      </Dialog>

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
