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

import { useParams, useRouter, usePathname } from '@/routes/hooks';

import { useClusterNode } from '@/hooks/contract';

import { longStringShorten } from '@/utils/string';

import { config } from '@/config';
import services from '@/services';
import { formatTimestamp } from '@/utils';
import { useSelectedValidator } from '@/stores';
import { useBoolean, useCopyToClipboard } from '@/hooks';
import {
  IRequestCommonPagination,
  IRequestValidatorActionEnum,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CopyButton from '@/components/copy-button';
import { useSnackbar } from '@/components/snackbar';
import { TableNoData, StyledTableCell } from '@/components/table';
import { ValidatorSetFeeReceiptBox } from '@/components/validator';
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
  const { status = IResponseValidatorStatusEnum.all } = useParams();
  // console.log('🚀 ~ status:', status);

  const pathname = usePathname();
  // console.log('🚀 ~ pathname:', pathname);

  const [currentPathname, setCurrentPathname] = useState(pathname);

  const { generateExitData } = useClusterNode();

  const router = useRouter();

  const { copy } = useCopyToClipboard();

  const { setSelectedValidator, resetSelectedValidator } = useSelectedValidator();

  const [validatorFilter, setValidatorFilter] = useState<{
    status: string;
  }>({
    status: IResponseValidatorStatusEnum.all,
  });

  const removeLoading = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const txPopover = usePopover();

  // const filterPopover = usePopover();

  const { value: dialogOpen, ...setDialogOpen } = useBoolean(false);
  const exitLoading = useBoolean();

  const [selectedRow, setSelectedRow] = useState<IResponseClusterNodeValidatorItem[]>([]);
  const [viewDepositRow, setViewDepositRow] = useState<IResponseClusterNodeValidatorItem[]>([]);
  const [selectedTxRow, setSelectedTxRow] = useState<IResponseClusterNodeValidatorItem>();

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    resetSelectedValidator();
    setCurrentPathname(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log('🚀 ~ useEffect ~ currentPathname:', currentPathname, pathname);
    if (currentPathname !== pathname) {
      setSelectedRow([]);
      setValidatorFilter({ status: status as IResponseValidatorStatusEnum });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // const viewValidatorClick = () => {
  //   setDialogOpen.onTrue();
  // };

  const handleApplyFilter = (filter: any) => {
    setValidatorFilter({ ...filter });
    setFilterDialogOpen(false);
  };

  const handleClearFilter = () => {
    setValidatorFilter({ status: IResponseValidatorStatusEnum.all });
    setFilterDialogOpen(false);
  };

  const isFilteredByAll = validatorFilter.status === IResponseValidatorStatusEnum.all;

  const filteredData = clusterValidatorQuery.data?.filter((row) => {
    if (isFilteredByAll) return true;
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

      const body = validators.map((v) => ({
        pubkey: v.pubkey,
        action: IRequestValidatorActionEnum.exit,
        txid: receipt?.transactionHash,
      }));

      await services.clusterNode.updateValidatorStatus(body);
      enqueueSnackbar('Exit validator successfully');
    } catch (error) {
      console.error('error', error);
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      exitLoading.onFalse();
    }
  };

  const checkStatus = (validatorStatus: IResponseValidatorStatusEnum) => {
    return selectedRow.every((row) => row.status === validatorStatus);
  };

  const checkPathnameStatus = (value: IResponseValidatorStatusEnum) => {
    return status === value;
  };

  const handleDepositETH = () => {
    // 1. lido csm batch register
    // 2. https://holesky.launchpad.ethereum.org/en/
    const isAllRegistered = checkStatus(IResponseValidatorStatusEnum.registered);

    if (!isAllRegistered) {
      handleToastStatus(IResponseValidatorStatusEnum.registered);
      return;
    }

    setSelectedValidator(selectedRow);
    router.push(config.routes.validator.home);
  };

  const handleToastStatus = (value: IResponseValidatorStatusEnum) => {
    enqueueSnackbar(`Please select all ${value} validators, or filter by status`, {
      variant: 'warning',
    });
  };

  return (
    <Card>
      <CardHeader
        title="Cluster validators"
        color="text.primary"
        sx={{ px: 2 }}
        // action={
        //   <IconButton color="inherit" onClick={popover.onOpen}>
        //     <Iconify icon="eva:more-vertical-fill" />
        //   </IconButton>
        // }
      />
      {!checkPathnameStatus(IResponseValidatorStatusEnum.all) && (
        <Stack direction="row" px={2} pt={2} pb={1} spacing={1}>
          {checkPathnameStatus(IResponseValidatorStatusEnum.ready) && (
            <Tooltip title="Run Validator on the SafeStake Network" placement="top">
              <LoadingButton
                variant="soft"
                color="inherit"
                disabled={selectedRow.length === 0}
                onClick={() => {
                  const isAllReady = checkStatus(IResponseValidatorStatusEnum.ready);

                  if (!isAllReady) {
                    handleToastStatus(IResponseValidatorStatusEnum.ready);
                    return;
                  }

                  setSelectedValidator(selectedRow);
                  router.push(config.routes.validator.validatorRegistrationNetwork);
                }}
              >
                Run Validator
              </LoadingButton>
            </Tooltip>
          )}

          {/* <LoadingButton
          variant="soft"
          color="inherit"
          loading={removeLoading.value}
          onClick={viewValidatorClick}
          disabled={selectedRow.length === 0}
        >
          View Deposit Data
        </LoadingButton> */}

          {checkPathnameStatus(IResponseValidatorStatusEnum.registered) && (
            <LoadingButton
              variant="soft"
              color="inherit"
              loading={removeLoading.value}
              onClick={handleDepositETH}
              disabled={selectedRow.length === 0}
            >
              Deposit ETH
            </LoadingButton>
          )}

          {checkPathnameStatus(IResponseValidatorStatusEnum.deposited) && (
            <LoadingButton
              variant="soft"
              color="inherit"
              loading={exitLoading.value}
              disabled={selectedRow.length === 0}
              onClick={() => {
                const isAllDeposited = checkStatus(IResponseValidatorStatusEnum.deposited);

                if (!isAllDeposited) {
                  handleToastStatus(IResponseValidatorStatusEnum.deposited);
                  return;
                }

                handleExitValidator(selectedRow);
              }}
            >
              Exit Validator
            </LoadingButton>
          )}

          {/* <LoadingButton
          variant="soft"
          color="inherit"
          onClick={() => setFeeReceiptDialogOpen.onTrue()}
        >
          Update Fee Recipient Address
        </LoadingButton> */}
        </Stack>
      )}

      <ValidatorSetFeeReceiptBox address={address} />

      {/* <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem
          onClick={() => {
            resetAll();
            router.push(config.routes.validator.validatorExit);
          }}
        >
          <Iconify width={24} icon="iconamoon:exit-bold" color={theme.palette.grey[600]} />
          Validator Exit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setFeeReceiptDialogOpen.onTrue();
          }}
        >
          <Iconify width={24} icon="mingcute:edit-line" color={theme.palette.grey[600]} />
          Update Fee Recipient Address
        </MenuItem>
      </CustomPopover> */}

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
                      setSelectedRow(filteredData || []);
                    } else {
                      setSelectedRow([]);
                    }
                  }}
                />
              </StyledTableCell>

              <StyledTableCell align="left">
                <Typography variant="caption">Public Key</Typography>
              </StyledTableCell>

              {/* <StyledTableCell align="left">
                <Typography variant="caption">Owner</Typography>
              </StyledTableCell> */}

              <StyledTableCell
                align="center"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: () => theme.palette.primary.main,
                  },
                }}
              >
                {status === IResponseValidatorStatusEnum.all ? (
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
                        {Object.values(IResponseValidatorStatusEnum).map((validatorStatus) => (
                          <MenuItem
                            key={validatorStatus}
                            onClick={() => {
                              setValidatorFilter({ status: validatorStatus });
                              // filterPopover.onClose();
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={validatorFilter.status === validatorStatus}
                                  onChange={() => {
                                    setValidatorFilter({ status: validatorStatus });
                                    // filterPopover.onClose();
                                  }}
                                />
                              }
                              label={validatorStatus}
                            />
                          </MenuItem>
                        ))}
                      </Stack>
                    }
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.5}
                    >
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
                ) : (
                  <Typography variant="caption">Status</Typography>
                )}
              </StyledTableCell>

              <StyledTableCell align="center">Created At</StyledTableCell>

              <StyledTableCell align="right">Action</StyledTableCell>
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

                  {/* <TableCell align="left">
                    <Typography variant="body2" color="text.secondary">
                      {longStringShorten(row.owner)}
                    </Typography>
                  </TableCell> */}

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

                  <TableCell align="right">
                    <Tooltip title="View Validator" placement="top">
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          if (selectedRow.length <= 1) {
                            setViewDepositRow([row]);
                          } else {
                            setViewDepositRow(selectedRow);
                          }
                          setDialogOpen.onTrue();
                        }}
                      >
                        <Iconify icon="mdi:eye" color={theme.palette.grey[600]} />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      color="inherit"
                      onClick={(event) => {
                        setSelectedTxRow(row);
                        txPopover.onOpen(event);
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
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
                viewDepositRow.map((row) => JSON.parse(row.deposit_data)),
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
                  viewDepositRow.map((row) => JSON.parse(row.deposit_data)),
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
                viewDepositRow.map((row) => JSON.parse(row.deposit_data)),
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

      <CustomPopover open={txPopover.open} onClose={txPopover.onClose}>
        {selectedTxRow?.generate_txid && (
          <MenuItem>
            <Link href={`${config.links.etherTxLink(selectedTxRow.generate_txid)}`} target="_blank">
              Generate Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.register_txid && (
          <MenuItem>
            <Link href={`${config.links.etherTxLink(selectedTxRow.register_txid)}`} target="_blank">
              Register Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.deposit_txid && (
          <MenuItem>
            <Link href={`${config.links.etherTxLink(selectedTxRow.deposit_txid)}`} target="_blank">
              Deposit Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.exit_txid && (
          <MenuItem>
            <Link href={`${config.links.etherTxLink(selectedTxRow.exit_txid)}`} target="_blank">
              Exit Tx
            </Link>
          </MenuItem>
        )}
      </CustomPopover>

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
                .map((validatorStatus) => (
                  <FormControlLabel
                    key={validatorStatus}
                    control={
                      <Checkbox
                        checked={validatorFilter.status === validatorStatus}
                        onChange={(e) => {
                          setValidatorFilter({
                            status: e.target.checked ? validatorStatus : '',
                          });
                        }}
                      />
                    }
                    label={upperFirst(validatorStatus)}
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
    </Card>
  );
}
