import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { enqueueSnackbar } from 'notistack';
import { Fragment, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Link,
  Table,
  Paper,
  Tooltip,
  Divider,
  Checkbox,
  TableRow,
  debounce,
  useTheme,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  TableContainer,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useOperatorList } from '@/hooks/api';
import { useClusterNode, ClusterNodeActionFee } from '@/hooks/contract/cluster-node';
import { useTokenApprovalWithAddress } from '@/hooks/contract/token/use-token-approval';

import { parseVersion, formatVersion } from '@/utils/format';

import { config } from '@/config';
import services from '@/services';
import { useBoolean } from '@/hooks';
import { SortTypeEnum } from '@/types';
import { useSelectedOperators } from '@/stores';

import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { CommonBack } from '@/components/common';
import { StyledTableCell } from '@/components/table';
import { OperatorTypeFilter } from '@/components/operator';
import { OperatorInfo } from '@/components/operator/operator-info';
import { OperatorCommitteeSizeSelector } from '@/components/operator/operator-committee-size-selector';

export default function ValidatorSelectorOperatorsPage() {
  const router = useRouter();

  const theme = useTheme();
  const { generateDepositData, getActionFee } = useClusterNode();
  const { address } = useAccount();

  const [filterBy, setFilterBy] = useState({});
  const [sort, setSort] = useState({ id: -1 } as any);
  const [searchInput, setSearchInput] = useState('');
  // const [pagination, setPagination] = useState<IRequestCommonPagination>(defaultPagination);

  const { operatorQuery } = useOperatorList(filterBy, sort, searchInput);
  const [sortId, setSortId] = useState<string>('');
  const [sortType = SortTypeEnum.asc, setSortType] = useState<SortTypeEnum>();
  const [validatorCount, setValidatorCount] = useState(1);
  const generateLoading = useBoolean();

  const { approveAllowance } = useTokenApprovalWithAddress(config.contractAddress.clusterNode);

  const {
    selectedOperators,
    handleSelectOperator,
    isSelectedOperators,
    allSelectedOperatorsVerified,
    isSelectedEnoughOperators,
    currentCommitteeSize,
    must2verifiedOperators,
  } = useSelectedOperators();

  // console.log(JSON.stringify(selectedOperators));

  const onClickSortId = (id: string) => {
    if (id === sortId) {
      setSortType(sortType === SortTypeEnum.asc ? SortTypeEnum.desc : SortTypeEnum.asc);
    } else {
      setSortType(SortTypeEnum.asc);
    }
    setSortId(id);
  };

  useEffect(() => {
    if (sortId) {
      const newSort = {
        [sortId]: sortType,
      };

      setSort(newSort);
    }

    // if (searchInput) {
    //   setFilterBy({
    //     ...filterBy,
    //     name: searchInput,
    //   });
    // } else {
    //   operatorQuery.refetch();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sortId, sortType, searchInput]);
  }, [sortId, sortType]);

  const handleScroll = (event: any) => {
    const element = event.target;
    // console.log(element.scrollTop + element.offsetHeight, element.scrollHeight);
    if (element.scrollTop + element.offsetHeight >= element.scrollHeight - 10) {
      updateValue(event);
    }
  };

  const updateValue = debounce((e: any) => {
    const element = e.target;

    // if (element.scrollTop + element.offsetHeight > element.scrollHeight - 100 && operatorsData.rows.length < operatorsData.count) {
    if (
      element.scrollTop + element.offsetHeight > element.scrollHeight - 200 &&
      operatorQuery.hasNextPage &&
      !operatorQuery.isFetching
    ) {
      // console.log(element.scrollTop);
      // const newPagination = {
      //   ...operatorsPagination,
      // };
      // newPagination.offset += newPagination.limit;
      // getOperators(newPagination);
      operatorQuery.fetchNextPage();
    }
  }, 300);

  const inputHandler = debounce((e: any) => {
    const userInput = e.target.value.trim();
    if (userInput.length >= 3) {
      setSearchInput(e.target.value.trim());
    } else {
      setSearchInput('');
    }
  }, 600);

  const onSelectOperatorsClick = async () => {
    // if (isExceedMaxOperators) {
    //   // enqueueSnackbar('Operator reached maximum amount of validators', { variant: 'error' });
    //   enqueueSnackbar(
    //     `One or more operators have reached the maximum allowed number of validators, which is currently set to ${config.maxValidatorCount}.`,
    //     { variant: 'error' }
    //   );
    //   return;
    // }

    try {
      generateLoading.onTrue();

      const result = await services.clusterNode.getInitiatorStatus();

      const fee = await getActionFee(ClusterNodeActionFee.GENERATE_DEPOSIT_DATA);

      const approveResult = await approveAllowance(fee! * BigInt(validatorCount));

      if (!approveResult.isTokenEnough) {
        enqueueSnackbar('Insufficient balance', { variant: 'error' });
        return;
      }

      const receipt = await generateDepositData(
        result.cluster_pubkey,
        validatorCount,
        // TODO: uncomment
        [12, 14, 15, 16],
        // selectedOperators.map((op) => op.id),
        parseEther('32'),
        address!
      );

      router.push(config.routes.validator.getConfirm(receipt?.transactionHash));
    } finally {
      generateLoading.onFalse();
    }
  };

  const updateValidatorCount = (e: any) => {
    setValidatorCount(+e.target.value);
  };

  return (
    <Container maxWidth="xl">
      <CommonBack />
      <Grid container spacing={2} my={2}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 2,
            }}
          >
            <CardHeader
              title="Pick the team of network operators to run you validator"
              sx={{ px: 0, pt: 0 }}
            />
            {false && (
              <Grid item xs={12} md={12} my={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" textAlign="center" color={theme.palette.grey[600]}>
                    Committee Size
                  </Typography>

                  <OperatorCommitteeSizeSelector />
                </Stack>
              </Grid>
            )}

            {false && (
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={10}>
                  <TextField
                    fullWidth
                    name="search"
                    type="text"
                    placeholder="Search"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={inputHandler}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          {operatorQuery.isFetching ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Iconify icon="material-symbols:search" />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <OperatorTypeFilter setFilterBy={setFilterBy} />
                </Grid>
              </Grid>
            )}
            <TableContainer
              sx={{ position: 'relative', maxHeight: 760, overflow: 'auto' }}
              onScroll={(e) => {
                handleScroll(e);
              }}
            >
              {/* <Scrollbar
            sx={{ maxHeight: 600, overflow: 'auto' }}
            ref={scrollRef}
          > */}
              <Table sx={{ minWidth: 600 }}>
                <TableHead
                  sx={{
                    backgroundColor: 'background.default',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <StyledTableCell padding="checkbox" />

                    <StyledTableCell
                      align="left"
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => onClickSortId('name')}
                    >
                      <Stack direction="row" alignItems="flex-end">
                        <Typography variant="caption" py={0.8}>
                          Name
                        </Typography>

                        {/* <CommonSortIcon sort={sortType} isActive={sortId === 'name'} /> */}
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => onClickSortId('id')}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <Stack direction="row" alignItems="flex-end" justifyContent="center">
                        <Typography variant="caption" py={0.8} pl={1}>
                          ID
                        </Typography>
                        {/* <CommonSortIcon sort={sortType} isActive={sortId === 'id'} /> */}
                      </Stack>
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      onClick={() => onClickSortId('validator_count')}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.5}
                      >
                        <Stack direction="row" alignItems="flex-end" justifyContent="center">
                          <Typography variant="caption" py={0.8} pl={1}>
                            Validator
                          </Typography>
                          {/* <CommonSortIcon sort={sortType} isActive={sortId === 'validator_count'} /> */}
                        </Stack>

                        {false && (
                          <Tooltip title="Monthly performance" enterTouchDelay={0}>
                            <Iconify icon="material-symbols:info" width={16} />
                          </Tooltip>
                        )}
                      </Stack>
                    </StyledTableCell>

                    <StyledTableCell align="center">Version</StyledTableCell>
                    <StyledTableCell padding="checkbox"> </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {operatorQuery?.data?.pages.map((page, pageIndex) => (
                    <Fragment key={pageIndex}>
                      {page.rows.map((row, index) => (
                        <TableRow
                          hover
                          key={index}
                          onClick={(e) => {
                            const version = formatVersion(row.last_version);

                            if (version === 'unkown') {
                              enqueueSnackbar(
                                'Operator has unkown version, please try another operator',
                                { variant: 'error' }
                              );
                              return;
                            }

                            const firstOp = selectedOperators[0];
                            if (firstOp) {
                              const firstOpVersion = parseVersion(firstOp.last_version);
                              const currentOpVersion = parseVersion(row.last_version);
                              if (firstOpVersion.majorVersion !== currentOpVersion.majorVersion) {
                                enqueueSnackbar('Operators must have the same major version', {
                                  variant: 'error',
                                });
                              }
                            }

                            handleSelectOperator(row);
                          }}
                          selected={isSelectedOperators(row)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isSelectedOperators(row)} />
                          </TableCell>
                          <TableCell>
                            {/* <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar src="/assets/operator/light.svg" />
                              <Stack direction="column">
                                <Stack direction="row" alignItems="center">
                                  <Typography sx={{ color: `text.primary` }}>{row.name}</Typography>
                                  <OperatorType operator={row} />
                                </Stack>
                                <Typography variant="body2" sx={{ color: `text.disabled` }}>
                                  {longStringShorten(row.pk)}
                                </Typography>
                              </Stack>
                            </Stack> */}
                            <OperatorInfo operator={row} />
                          </TableCell>
                          <TableCell align="center">{row.id}</TableCell>
                          <TableCell align="center">{row.validator_count}</TableCell>
                          <TableCell align="center">{formatVersion(row.last_version)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`${config.links.operator(row.id)}`, '_blank');
                              }}
                            >
                              <Iconify icon="uil:chart" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>

                {/* <Box
                id="scroll-anchor"
                sx={{
                  height: 20,
                  width: 1,
                }}
              /> */}
              </Table>
              {/* </Scrollbar> */}
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Selected Operators</Typography>

                  <Typography variant="h6" color="secondary">
                    {selectedOperators.length}/{currentCommitteeSize.sharesNumber}
                  </Typography>
                </Stack>
              }
              // sx={{ px: 0, pt: 0 }}
              sx={{
                p: 2,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Scrollbar sx={{ maxHeight: 400, p: 2 }}>
                {Array(currentCommitteeSize.sharesNumber)
                  .fill(null)
                  .map((_, index) => (
                    // <Stack alignItems="center" justifyContent="center">

                    <Box
                      key={index}
                      sx={{
                        backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                        height: 70,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {selectedOperators[index] ? (
                        <OperatorInfo
                          operator={selectedOperators[index]}
                          onRemoveClick={() => handleSelectOperator(selectedOperators[index])}
                        />
                      ) : (
                        <Typography key={index} variant="body2" color="text.secondary">
                          Select Operator 0{index + 1}
                        </Typography>
                      )}
                    </Box>

                    // </Stack>
                  ))}
              </Scrollbar>

              <Divider sx={{ mt: 2, borderStyle: 'dashed' }} />

              <Stack sx={{ mx: 'auto', p: 2, mt: 1 }}>
                <Box sx={{ mb: 2 }}>
                  {selectedOperators.length > 1 && !must2verifiedOperators && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        borderColor: 'error.main',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ color: `error.main` }}>
                        You must select at least 2 verified operators.
                      </Typography>
                    </Paper>
                  )}
                </Box>

                <Box
                  sx={{
                    backgroundColor: 'background.default',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {!allSelectedOperatorsVerified && (
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: `primary.main` }}>
                        You have selected one or more operators that are{' '}
                        <Link
                          target="_blank"
                          underline="always"
                          href={config.links.notVerifiedLink}
                        >
                          not verified.
                        </Link>
                      </Typography>

                      <Typography gutterBottom variant="body2" sx={{ color: `primary.main` }}>
                        Unverified operators that were not reviewed and their identity is not
                        confirmed, may pose a threat to your validators’ performance.
                      </Typography>
                      <Typography gutterBottom variant="body2" sx={{ color: `primary.main` }}>
                        Please proceed only if you know and trust these operators.
                      </Typography>
                    </Paper>
                  )}

                  {selectedOperators.length === 0 && (
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: `primary.main` }}>
                        Please select the operators close to the same region in order to achieve
                        better performance with low latency.
                      </Typography>
                    </Paper>
                  )}
                </Box>

                <Box sx={{ width: 1, mb: 2 }} className="validator-count-input">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Please enter the number of validators you want to create.
                  </Typography>

                  <TextField
                    fullWidth
                    name="validator_count"
                    type="number"
                    size="medium"
                    inputProps={{
                      min: 1,
                      step: 1,
                      onKeyDown: (e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      },
                    }}
                    placeholder="Validator Count"
                    value={validatorCount}
                    onChange={updateValidatorCount}
                  />
                </Box>

                <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="soft"
                  loading={generateLoading.value}
                  disabled={!isSelectedEnoughOperators || !must2verifiedOperators}
                  onClick={onSelectOperatorsClick}
                >
                  Next
                </LoadingButton>

                {/* <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="soft"
                  loading={generateLoading.value}
                  onClick={onSelectOperatorsClick}
                >
                  Test Next
                </LoadingButton> */}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Box height={100} width={1} />
      </Grid>
    </Container>
  );
}
