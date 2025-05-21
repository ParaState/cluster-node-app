import { upperFirst } from 'lodash';
import React, { useState, useEffect } from 'react';
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
  TableHead,
  CardHeader,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  FormControlLabel,
} from '@mui/material';

import { useParams, useRouter } from '@/routes/hooks';

import { useClusterNode, useRegisterValidator } from '@/hooks/contract';

import { longStringShorten } from '@/utils/string';

import { config } from '@/config';
import services from '@/services';
import { useSelectedValidator } from '@/stores';
import { useBoolean, useCopyToClipboard } from '@/hooks';
import { formatTimestamp, getBaseBeaconchaUrl } from '@/utils';
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

import { SetStatusGroup } from '@/sections/my-account/set-status-group';

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

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  // console.log('🚀 ~ status:', status);

  // const pathname = usePathname();
  // console.log('🚀 ~ pathname:', pathname);

  // const [currentPathname, setCurrentPathname] = useState(pathname);

  const { generateExitData, getClusterNode } = useClusterNode();

  const router = useRouter();

  const { copy } = useCopyToClipboard();

  const { setSelectedValidator, resetSelectedValidator } = useSelectedValidator();

  const [validatorFilter, setValidatorFilter] = useState<{
    status: string;
  }>({
    // status: IResponseValidatorStatusEnum.all,
    status,
  });

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const txPopover = usePopover();

  // const filterPopover = usePopover();

  const { value: dialogOpen, ...setDialogOpen } = useBoolean(false);
  const exitLoading = useBoolean();
  const depositLoading = useBoolean();
  const runValidatorLoading = useBoolean();

  const [selectedRow, setSelectedRow] = useState<IResponseClusterNodeValidatorItem[]>([]);
  const [viewDepositRow, setViewDepositRow] = useState<IResponseClusterNodeValidatorItem[]>([]);
  const [selectedTxRow, setSelectedTxRow] = useState<IResponseClusterNodeValidatorItem>();

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const { filterValidatorIsRegistered } = useRegisterValidator();

  useEffect(() => {
    resetSelectedValidator();
    setSelectedRow([]);
  }, [status]);

  useEffect(() => {
    // console.log('🚀 ~ useEffect ~ status:', status);
    setValidatorFilter({ status });
  }, [status]);

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
      exitLoading.onTrue();

      // TODO: NEED TO CHECK IF THE VALIDATORS ARE EXITED
      // const results = await services.beaconcha.getValidatorsByGroup([
      //   ...selectedRow.map((v) => v.pubkey),
      //   // '0xa8fd06ccf9158357109e07272855bf7e988eede6de3751544228b3188d0a223d2a31f4d289a43a6a5fc3781af1c9a5fc',
      // ]);

      const epochResponse = await services.beaconcha.getLatestEpoch();
      const activeEpoch = epochResponse.data.epoch;

      const clusterPublicKey = validators[0].cluster_pubkey;
      const clusterNode = await getClusterNode(clusterPublicKey);
      const validatorPubKeys = validators.map((v) => v.pubkey);

      if (!clusterNode || !clusterNode.active) {
        enqueueSnackbar('Cluster node is not active', { variant: 'error' });
        return;
      }

      console.group('generateExitData');
      console.log('clusterPublicKey', clusterPublicKey);
      console.log('validatorPubKeys', validatorPubKeys);
      console.log('activeEpoch', activeEpoch);
      console.log('clusterNode', clusterNode);
      console.groupEnd();

      const receipt = await generateExitData(clusterPublicKey, validatorPubKeys, activeEpoch);

      const body = validators.map((v) => ({
        pubkey: v.pubkey,
        action: IRequestValidatorActionEnum.exit,
        txid: receipt?.transactionHash,
      }));

      await services.clusterNode.updateValidatorStatus(body);
      enqueueSnackbar('Exit validator successfully, the validators status will be updated soon.');
      setExitDialogOpen(false);
      setSelectedRow([]);
      await clusterValidatorQuery.refetch();
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

  const handleDepositETH = async () => {
    try {
      depositLoading.onTrue();
      // 1. lido csm batch register
      // 2. https://holesky.launchpad.ethereum.org/en/
      const isAllRegistered = checkStatus(IResponseValidatorStatusEnum.registered);

      if (!isAllRegistered) {
        handleToastStatus(IResponseValidatorStatusEnum.registered);
        return;
      }

      // TODO: REMOVE
      // setSelectedValidator(selectedRow);
      // router.push(config.routes.validator.home);

      const results = await services.beaconcha.getValidatorsByGroup([
        ...selectedRow.map((v) => v.pubkey),
        // '0xa8fd06ccf9158357109e07272855bf7e988eede6de3751544228b3188d0a223d2a31f4d289a43a6a5fc3781af1c9a5fc',
      ]);

      // await services.clusterNode.updateValidatorStatus([
      //   {
      //     pubkey:
      //       '0xa8fd06ccf9158357109e07272855bf7e988eede6de3751544228b3188d0a223d2a31f4d289a43a6a5fc3781af1c9a5fc',
      //     action: IRequestValidatorActionEnum.deposit,
      //     txid: '',
      //   },
      // ]);

      const { canDepositValidator, canExitValidator, isExitedValidator } = results;

      const canDepositValidators = selectedRow.filter((v) => canDepositValidator.get(v.pubkey));
      const canExitValidators = selectedRow.filter((v) => canExitValidator.get(v.pubkey));
      const isExitedValidators = selectedRow.filter((v) => isExitedValidator.get(v.pubkey));

      if (canExitValidators.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          canExitValidators.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.deposit,
            txid: '',
          }))
        );

        enqueueSnackbar(
          `Validator status updated successfully. ${canExitValidators.length} validators are already deposited.`
        );

        await clusterValidatorQuery.refetch();
      }

      if (isExitedValidators.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          isExitedValidators.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.exit,
            txid: '',
          }))
        );

        await clusterValidatorQuery.refetch();
      }

      if (canDepositValidators.length <= 0) {
        enqueueSnackbar('No validators available for deposit', { variant: 'info' });
        return;
      }

      setSelectedValidator(canDepositValidators);
      router.push(config.routes.validator.home);
    } finally {
      depositLoading.onFalse();
    }
  };

  const handleToastStatus = (value: IResponseValidatorStatusEnum) => {
    enqueueSnackbar(`Please select all ${value} validators, or filter by status`, {
      variant: 'warning',
    });
  };

  const handleRunValidator = async () => {
    try {
      runValidatorLoading.onTrue();

      console.log(selectedRow);
      const { registered, notRegistered } = await filterValidatorIsRegistered(selectedRow);
      // console.log('🚀 ~ handleRunValidator ~ registered:', registered);
      // console.log('🚀 ~ handleRunValidator ~ notRegistered:', notRegistered);

      if (registered.length > 0) {
        await services.clusterNode.updateValidatorStatus(
          registered.map((v) => ({
            pubkey: v.pubkey,
            action: IRequestValidatorActionEnum.register,
            txid: v.register_txid || '',
          }))
        );
        enqueueSnackbar(
          `Validator status updated successfully. ${registered.length} validators are already registered.`
        );

        await clusterValidatorQuery.refetch();
      }

      if (notRegistered.length <= 0) {
        enqueueSnackbar('No validators available for registration', { variant: 'info' });
        return;
      }

      setSelectedValidator(notRegistered);
      router.push(config.routes.validator.validatorRegistrationNetwork);
    } finally {
      runValidatorLoading.onFalse();
    }
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
      {localStorage.getItem('set-status-debug-mode') === 'true' && (
        <SetStatusGroup clusterValidatorQuery={clusterValidatorQuery} selectedRow={selectedRow} />
      )}
      {checkPathnameStatus(IResponseValidatorStatusEnum.all) && (
        <Stack direction="row" px={2} pt={2} pb={1} spacing={1}>
          <LoadingButton
            component="span"
            variant="soft"
            color="inherit"
            disabled={selectedRow.length === 0}
            onClick={() => {
              setSelectedValidator(selectedRow);
              router.push(config.routes.validator.sync);
            }}
            loading={runValidatorLoading.value}
          >
            Sync Validator Status
          </LoadingButton>
        </Stack>
      )}
      {!checkPathnameStatus(IResponseValidatorStatusEnum.all) && (
        <Stack direction="row" px={2} pt={2} pb={1} spacing={1}>
          {checkPathnameStatus(IResponseValidatorStatusEnum.ready) && (
            <Tooltip title="Run Validator on the SafeStake Network" placement="top">
              <LoadingButton
                component="span"
                variant="soft"
                color="inherit"
                disabled={selectedRow.length === 0}
                onClick={handleRunValidator}
                loading={runValidatorLoading.value}
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
              loading={depositLoading.value}
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

                setExitDialogOpen(true);
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

      <ValidatorSetFeeReceiptBox address={address} sx={{ p: 2 }} />

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
            <TableHead
              sx={{
                backgroundColor: 'background.default',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              <TableRow>
                {/* {!checkPathnameStatus(IResponseValidatorStatusEnum.all) && ( */}
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      !!selectedRow.length && selectedRow.length < (filteredData?.length || 0)
                    }
                    checked={!!filteredData?.length && selectedRow.length === filteredData?.length}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked) {
                        setSelectedRow(filteredData || []);
                      } else {
                        setSelectedRow([]);
                      }
                    }}
                  />
                </StyledTableCell>
                {/* )} */}

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

                <StyledTableCell align="center">Operators</StyledTableCell>

                <StyledTableCell align="center">Created At</StyledTableCell>

                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clusterValidatorQuery.isLoading && <SimpleTableSkeleton skeletonCounter={10} />}
              {filteredData?.map((row, index) => (
                <TableRow key={index}>
                  {/* {!checkPathnameStatus(IResponseValidatorStatusEnum.all) && ( */}
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
                  {/* )} */}

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
                    <Stack alignItems="center" direction="row" justifyContent="center">
                      {row.operators.map((operator, kindex) => (
                        <Typography key={`${kindex}-${index}`} variant="body2">
                          <Link
                            href={`${config.links.operator(operator.operator_id)}`}
                            target="_blank"
                          >
                            {operator.operator_id}
                          </Link>
                          &nbsp;
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(row.created_at)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                      <Tooltip title="View Deposit Data" placement="top">
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
                      <Tooltip title="View Validator on Beaconcha" placement="top">
                        <IconButton
                          target="_blank"
                          href={`${getBaseBeaconchaUrl()}/validator/${row.pubkey}`}
                        >
                          <Iconify
                            width={26}
                            icon="mingcute:radar-2-line"
                            className="caption"
                            color={theme.palette.grey[700]}
                            sx={{ mt: 0.5 }}
                          />
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
                    </Stack>
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
            <Link
              color="inherit"
              href={`${config.links.etherTxLink(selectedTxRow.generate_txid)}`}
              target="_blank"
            >
              View Generation Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.register_txid && (
          <MenuItem>
            <Link
              color="inherit"
              href={`${config.links.etherTxLink(selectedTxRow.register_txid)}`}
              target="_blank"
            >
              View Registration Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.deposit_txid && (
          <MenuItem>
            <Link
              color="inherit"
              href={`${config.links.etherTxLink(selectedTxRow.deposit_txid)}`}
              target="_blank"
            >
              View Deposit Tx
            </Link>
          </MenuItem>
        )}
        {selectedTxRow?.exit_txid && (
          <MenuItem>
            <Link
              color="inherit"
              href={`${config.links.etherTxLink(selectedTxRow.exit_txid)}`}
              target="_blank"
            >
              View Exit Tx
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

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Confirm Exit Validators</Typography>
            <IconButton
              disabled={exitLoading.value}
              aria-label="close"
              onClick={() => setExitDialogOpen(false)}
            >
              <Iconify icon="eva:close-fill" color={theme.palette.common.black} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to exit {selectedRow.length} validator
            {selectedRow.length !== 1 ? 's' : ''}?
          </Typography>
          <Typography variant="body2" color="error.main">
            This action cannot be undone. Your validators will be removed from the network and your
            staked ETH will be returned to your withdrawal address.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)} disabled={exitLoading.value}>
            Cancel
          </Button>
          <LoadingButton
            onClick={() => handleExitValidator(selectedRow)}
            variant="contained"
            color="error"
            loading={exitLoading.value}
          >
            Confirm Exit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
