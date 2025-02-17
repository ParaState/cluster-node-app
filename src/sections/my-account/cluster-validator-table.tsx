import { upperFirst } from 'lodash';
import { useState, useEffect } from 'react';
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
  Tooltip,
  TableRow,
  useTheme,
  MenuItem,
  Checkbox,
  TableBody,
  TableCell,
  FormGroup,
  CardHeader,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  FormControlLabel,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useClusterNode, useFeeReceiptAddress } from '@/hooks/contract';

import { longStringShorten } from '@/utils/string';

import { config } from '@/config';
import { formatTimestamp } from '@/utils';
import { useBoolean, useCopyToClipboard } from '@/hooks';
import { useSelectedOperators, useSelectedValidator } from '@/stores';
import {
  IRequestCommonPagination,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CopyButton from '@/components/copy-button';
import { useSnackbar } from '@/components/snackbar';
import { TableNoData, StyledTableCell } from '@/components/table';
import CustomPopover, { usePopover } from '@/components/custom-popover';
import SimpleTableSkeleton from '@/components/table/simple-table-skeleton';

import { ValidatorSetFeeReceiptBox, ValidatorSetFeeReceiptDialog } from '@/sections/my-account';

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
  const { generateExitData } = useClusterNode();

  const router = useRouter();

  const { copy } = useCopyToClipboard();

  const { getFeeRecipientAddressQuery } = useFeeReceiptAddress(address!);

  const { setSelectedValidator, resetSelectedValidator } = useSelectedValidator();

  const [validatorFilter, setValidatorFilter] = useState<{
    status: string;
  }>({
    status: IResponseValidatorStatusEnum.all,
  });

  useEffect(() => {
    resetSelectedValidator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeLoading = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { resetAll } = useSelectedOperators();

  const theme = useTheme();

  const popover = usePopover();
  // const filterPopover = usePopover();

  const { value: dialogOpen, ...setDialogOpen } = useBoolean(false);
  const { value: feeReceiptDialogOpen, ...setFeeReceiptDialogOpen } = useBoolean(false);
  const exitLoading = useBoolean();

  const [selectedRow, setSelectedRow] = useState<IResponseClusterNodeValidatorItem[]>([]);

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const viewValidatorClick = async () => {
    setDialogOpen.onTrue();
  };

  const handleApplyFilter = (filter: any) => {
    setValidatorFilter({ ...filter });
    setFilterDialogOpen(false);
  };

  const handleClearFilter = () => {
    setValidatorFilter({ status: IResponseValidatorStatusEnum.all });
    setFilterDialogOpen(false);
  };

  const filteredData = clusterValidatorQuery.data?.filter((row) => {
    if (validatorFilter.status === IResponseValidatorStatusEnum.all) return true;
    return row.status === validatorFilter.status;
  });

  const handleExitValidator = async (validators: IResponseClusterNodeValidatorItem[]) => {
    try {
      console.log('exit validator', validators);
      exitLoading.onTrue();
      const clusterPublicKey = validators[0].pubkey;
      const validatorPubKeys = validators.map((v) => v.pubkey);
      const activeEpoch = 1;

      const receipt = await generateExitData(clusterPublicKey, validatorPubKeys, activeEpoch);

      console.log('transactionHash', receipt?.transactionHash);
    } catch (error) {
      console.error('error', error);
    } finally {
      exitLoading.onFalse();
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
      <Stack direction="row" px={2} pt={2} pb={1} spacing={1}>
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
          disabled={selectedRow.length === 0}
          onClick={() => {
            const isAllReady = selectedRow.every(
              (row) => row.status === IResponseValidatorStatusEnum.ready
            );
            if (isAllReady) {
              setSelectedValidator(selectedRow);
              router.push(config.routes.validator.validatorRegistrationNetwork);
            } else {
              enqueueSnackbar('Please select all ready validators');
            }
          }}
        >
          Register Validator
        </LoadingButton>

        <LoadingButton
          variant="soft"
          color="inherit"
          loading={exitLoading.value}
          disabled={selectedRow.length === 0}
          onClick={() => {
            // TODO
            // const isAllDeposited = selectedRow.every(
            //   (row) => row.status === IResponseValidatorStatusEnum.deposited
            // );
            // if (isAllDeposited) {
            handleExitValidator(selectedRow);
            // } else {
            //   enqueueSnackbar('Please select all deposited validators');
            // }
          }}
        >
          Exit Validator
        </LoadingButton>

        <LoadingButton
          variant="soft"
          color="inherit"
          onClick={() => setFeeReceiptDialogOpen.onTrue()}
        >
          Set Fee Recipient Address
        </LoadingButton>
      </Stack>

      <ValidatorSetFeeReceiptBox address={address} />

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
            <TableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    !!selectedRow.length &&
                    selectedRow.length < (clusterValidatorQuery.data?.length || 0)
                  }
                  checked={
                    !!clusterValidatorQuery.data?.length &&
                    selectedRow.length === clusterValidatorQuery.data?.length
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.checked) {
                      setSelectedRow(clusterValidatorQuery.data || []);
                    } else {
                      setSelectedRow([]);
                    }
                  }}
                />
              </StyledTableCell>

              <StyledTableCell align="left">
                <Typography variant="caption">Public Key</Typography>
              </StyledTableCell>

              <StyledTableCell align="left">
                <Typography variant="caption">Owner</Typography>
              </StyledTableCell>

              <StyledTableCell
                align="center"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: () => theme.palette.primary.main,
                  },
                }}
                // onClick={(event) => {
                //   // setFilterDialogOpen(true);
                //   filterPopover.onOpen(event);
                // }}
              >
                <Tooltip
                  slotProps={{
                    tooltip: {
                      sx: {
                        color: '#514E6A',
                        backgroundColor: '#ffff',
                        boxShadow: theme.customShadows.dropdown,
                        p: theme.spacing(1),
                      },
                    },
                  }}
                  title={
                    <Stack spacing={1}>
                      {Object.values(IResponseValidatorStatusEnum).map((status) => (
                        <MenuItem
                          key={status}
                          onClick={() => {
                            setValidatorFilter({ status });
                            // filterPopover.onClose();
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={validatorFilter.status === status}
                                onChange={() => {
                                  setValidatorFilter({ status });
                                  // filterPopover.onClose();
                                }}
                              />
                            }
                            label={status}
                          />
                        </MenuItem>
                      ))}
                    </Stack>
                  }
                >
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                    <Typography variant="caption">Status</Typography>
                    <Iconify
                      icon={
                        validatorFilter.status !== IResponseValidatorStatusEnum.all
                          ? 'iconoir:filter-solid'
                          : 'iconoir:filter'
                      }
                      width={16}
                    />
                  </Stack>
                </Tooltip>
              </StyledTableCell>

              <StyledTableCell align="right">Created At</StyledTableCell>
            </TableRow>

            <TableBody>
              {clusterValidatorQuery.isLoading && <SimpleTableSkeleton skeletonCounter={10} />}
              {filteredData?.map((row, index) => (
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
                        data-tooltip-id="pubkey-tooltip"
                        data-tooltip-content={row.pubkey}
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

                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(row.created_at)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {filteredData?.length === 0 && <TableNoData />}
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
              copy(
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

      {/* <CustomPopover
        open={filterPopover.open}
        onClose={filterPopover.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Object.values(IResponseValidatorStatusEnum).map((status) => (
          <MenuItem
            key={status}
            onClick={() => {
              setValidatorFilter({ status });
              filterPopover.onClose();
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={validatorFilter.status === status}
                  onChange={() => {
                    setValidatorFilter({ status });
                    filterPopover.onClose();
                  }}
                />
              }
              label={upperFirst(status)}
            />
          </MenuItem>
        ))}
      </CustomPopover> */}

      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Filter by Status</Typography>
            <IconButton aria-label="close" onClick={() => setFilterDialogOpen(false)}>
              <Iconify icon="eva:close-fill" color={theme.palette.common.black} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {/* <TextField
              fullWidth
              label="Public Key"
              value={publicKeyFilter}
              onChange={(e) => setPublicKeyFilter(e.target.value)}
              sx={{ my: 1 }}
            /> */}
            <FormGroup>
              {Object.values(IResponseValidatorStatusEnum)
                // .filter((status) => status !== IResponseValidatorStatusEnum.all)
                .map((status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox
                        checked={validatorFilter.status === status}
                        onChange={(e) => {
                          setValidatorFilter({
                            status: e.target.checked ? status : '',
                          });
                        }}
                      />
                    }
                    label={upperFirst(status)}
                  />
                ))}
            </FormGroup>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilter}>Clear</Button>
          <Button onClick={() => handleApplyFilter(validatorFilter)} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <ValidatorSetFeeReceiptDialog
        dialogOpen={feeReceiptDialogOpen}
        onClose={setFeeReceiptDialogOpen.onFalse}
      />
    </Card>
  );
}
