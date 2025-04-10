import { z } from 'zod';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatEther, isAddressEqual, TransactionReceipt } from 'viem';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Step,
  Radio,
  Button,
  Stepper,
  Collapse,
  Skeleton,
  Container,
  StepLabel,
  Typography,
  CardHeader,
  IconButton,
  RadioGroup,
  StepContent,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { useRouter } from '@/routes/hooks';

import { useBoolean } from '@/hooks/use-boolean';
import { useOperatorLidoCSMList } from '@/hooks/api/operator/use-operator-list';
import {
  useGetNodeOperator,
  useAddNodeOperatorETH,
  useAddValidatorKeysETH,
  useGetRequiredBondForNextKeys,
} from '@/hooks/contract';

import { config } from '@/config';
import services from '@/services';
import { useNodeOperatorId, useSelectedValidator } from '@/stores';

import Iconify from '@/components/iconify';
import { CommonBack } from '@/components/common';
import FormProvider from '@/components/hook-form';
import { ValidatorBeachonLink } from '@/components/validator';

import {
  IRequestValidatorActionEnum,
  IResponseValidatorDepositData,
} from '@/types/response/clusterNode';

const formSchema = z.object({
  nodeOperatorId: z.number().min(0),
});

const batchSize = 25;

export default function LidoCSMRegistrationPage() {
  const { address } = useAccount();
  // const client = usePublicClient();
  const router = useRouter();

  const { nodeOperatorId, setNodeOperatorId } = useNodeOperatorId();

  const { selectedValidator } = useSelectedValidator();

  const { data: operatorLidoCSMList, isLoading: operatorLidoCSMLoading } = useOperatorLidoCSMList(
    address!
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (nodeOperatorId) {
      form.setValue('nodeOperatorId', +nodeOperatorId);
    }
  }, []);

  const { handleSubmit } = form;

  const clusterNodeValidatorsGrouped = Array.from(
    { length: Math.ceil(selectedValidator.length / batchSize) },
    (_, i) => selectedValidator.slice(i * batchSize, (i + 1) * batchSize)
  );

  const [successIndex, setSuccessIndex] = useState<number[]>([]);
  const [bondValues, setBondValues] = useState<bigint[]>([]);

  const { getRequiredBondForNextKeys, getBondAmountByKeysCount } = useGetRequiredBondForNextKeys();
  const { addValidatorKeysETH } = useAddValidatorKeysETH();
  const { addNodeOperatorETH, decodeNodeOperatorAddedEvent } = useAddNodeOperatorETH();

  const [publicKeyOpens, setPublicKeyOpens] = useState<boolean[]>(
    clusterNodeValidatorsGrouped.map(() => false)
  );

  const checkNodeOperatorLoading = useBoolean();

  const [runningValidatorIndex, setRunningValidatorIndex] = useState<number | null>(null);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const { getNodeOperator } = useGetNodeOperator();

  const setPublicKeyOpenByIndex = (index: number) => {
    setPublicKeyOpens((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });
  };

  const setBondValueByIndex = (index: number, value: bigint) => {
    setBondValues((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  useEffect(() => {
    setActiveStep(0);
  }, []);

  // const onTestClick = async (index: number) => {
  //   // const receipt = await client?.waitForTransactionReceipt({
  //   //   hash: '0xc802ace7434e7bd5dde725318e602184f17848dc64f27675455ef4209fa80662',
  //   // });

  //   // console.log('🚀 ~ onTestClick ~ receipt:', receipt);

  //   // const nodeOperatorAddedEvent = decodeNodeOperatorAddedEvent(receipt);
  //   // console.log('🚀 ~ onTestClick ~ nodeOperatorAddedEvent:', nodeOperatorAddedEvent);
  //   setRunningValidatorIndex(index);

  //   const currentGroupValidators = clusterNodeValidatorsGrouped[index];

  //   const bondValue = await getBondAmountByKeysCount(currentGroupValidators.length);

  //   setBondValueByIndex(index, bondValue);

  //   const depositData: IResponseValidatorDepositData[] = currentGroupValidators.map((v) =>
  //     JSON.parse(v.deposit_data)
  //   );

  //   const keysCount = depositData.length;
  //   const publicKeys = `0x${depositData.map((deposit) => deposit.pubkey).join('')}`;
  //   const signatures = `0x${depositData.map((deposit) => deposit.signature).join('')}`;

  //   const receipt = await addNodeOperatorETH(keysCount, publicKeys, signatures, bondValue);

  //   const nodeOperatorAddedEvent = decodeNodeOperatorAddedEvent(receipt);
  //   console.log('🚀 ~ onTestClick ~ nodeOperatorAddedEvent:', nodeOperatorAddedEvent);

  //   if (nodeOperatorAddedEvent?.nodeOperatorId) {
  //     setNodeOperatorId(nodeOperatorAddedEvent?.nodeOperatorId.toString());
  //   }
  // };

  // const onRunValidatorClick = async (index: number) => {
  //   setRunningValidatorIndex(index);

  //   try {
  //     const currentGroupValidators = clusterNodeValidatorsGrouped[index];
  //     console.log('🚀 ~ onRunValidatorClick ~ currentGroupValidators:', currentGroupValidators);

  //     const bondValue = await getRequiredBondForNextKeys(
  //       +nodeOperatorId,
  //       currentGroupValidators.length
  //     );
  //     setBondValueByIndex(index, bondValue);

  //     const depositData: IResponseValidatorDepositData[] = currentGroupValidators.map((v) =>
  //       JSON.parse(v.deposit_data)
  //     );

  //     const keysCount = depositData.length;
  //     const publicKeys = `0x${depositData.map((deposit) => deposit.pubkey).join('')}`;
  //     const signatures = `0x${depositData.map((deposit) => deposit.signature).join('')}`;

  //     const receipt = await addValidatorKeysETH(
  //       +nodeOperatorId,
  //       keysCount,
  //       publicKeys,
  //       signatures,
  //       bondValue
  //     );

  //     const body = currentGroupValidators.map((v) => ({
  //       pubkey: v.pubkey,
  //       action: IRequestValidatorActionEnum.deposit,
  //       txid: receipt!.transactionHash,
  //     }));

  //     await services.clusterNode.updateValidatorStatus(body);
  //     setSuccessIndex((prev) => [...prev, index]);
  //   } catch (error) {
  //     console.log('🚀 ~ onRunValidatorClick ~ error:', error);
  //     enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
  //   } finally {
  //     setRunningValidatorIndex(null);
  //   }
  // };

  const onRunValidatorClick = async (index: number) => {
    setRunningValidatorIndex(index);

    try {
      const currentGroupValidators = clusterNodeValidatorsGrouped[index];

      let bondValue = 0n;

      if (!nodeOperatorId) {
        bondValue = await getBondAmountByKeysCount(currentGroupValidators.length);
      } else {
        bondValue = await getRequiredBondForNextKeys(
          +nodeOperatorId,
          currentGroupValidators.length
        );
      }

      setBondValueByIndex(index, bondValue);

      const depositData: IResponseValidatorDepositData[] = currentGroupValidators.map((v) =>
        JSON.parse(v.deposit_data)
      );

      const keysCount = depositData.length;
      const publicKeys = `0x${depositData.map((deposit) => deposit.pubkey).join('')}`;
      const signatures = `0x${depositData.map((deposit) => deposit.signature).join('')}`;

      let receipt: TransactionReceipt | undefined;

      if (!nodeOperatorId) {
        receipt = await addNodeOperatorETH(keysCount, publicKeys, signatures, bondValue);

        const nodeOperatorAddedEvent = decodeNodeOperatorAddedEvent(receipt);
        console.log('🚀 ~ onTestClick ~ nodeOperatorAddedEvent:', nodeOperatorAddedEvent);

        if (nodeOperatorAddedEvent?.nodeOperatorId) {
          setNodeOperatorId(nodeOperatorAddedEvent?.nodeOperatorId);
        }
      } else {
        receipt = await addValidatorKeysETH(
          +nodeOperatorId,
          keysCount,
          publicKeys,
          signatures,
          bondValue
        );
      }

      const body = currentGroupValidators.map((v) => ({
        pubkey: v.pubkey,
        action: IRequestValidatorActionEnum.deposit,
        txid: receipt!.transactionHash,
      }));

      await services.clusterNode.updateValidatorStatus(body);
      setSuccessIndex((prev) => [...prev, index]);
    } catch (error) {
      console.log('🚀 ~ onRunValidatorClick ~ error:', error);
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      setRunningValidatorIndex(null);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    checkNodeOperatorLoading.onTrue();

    setNodeOperatorId(data.nodeOperatorId);

    try {
      const result = await getNodeOperator(data.nodeOperatorId);
      console.log('🚀 ~ onSubmit ~ result:', result);

      if (!isAddressEqual(result?.managerAddress as `0x${string}`, address!)) {
        enqueueSnackbar('Current Node Operator Manager Address is not your address', {
          variant: 'error',
        });

        return;
      }

      handleNext();
    } catch (error) {
      enqueueSnackbar(error?.details || error?.message, { variant: 'error' });
    } finally {
      checkNodeOperatorLoading.onFalse();
    }
    // router.push(config.routes.validator.validatorGenerateConfirm);
  });

  const steps = [
    {
      label: `Select Or Create Your Node Operator`,
      render: () => {
        return (
          <Stack direction="column" alignItems="start" flexGrow={1}>
            <FormProvider methods={form} onSubmit={onSubmit}>
              <Box sx={{ width: 1, mb: 2 }}>
                {operatorLidoCSMLoading ? (
                  <Skeleton variant="rectangular" height={36} />
                ) : (
                  <FormControl>
                    <RadioGroup
                      row
                      defaultValue={form.getValues('nodeOperatorId')}
                      onChange={(e) => {
                        setNodeOperatorId(+e.target.value);
                        form.setValue('nodeOperatorId', +e.target.value);
                      }}
                    >
                      {operatorLidoCSMList?.rows.map((item) => (
                        <FormControlLabel
                          key={item.operator_id}
                          value={item.operator_id}
                          control={<Radio />}
                          label={`Node Operator #${item.operator_id.toString()}`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </Box>

              <Stack direction="row" width={1} spacing={2}>
                <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="soft"
                  sx={{ width: 100 }}
                  loading={checkNodeOperatorLoading.value}
                  disabled={operatorLidoCSMLoading || !form.getValues('nodeOperatorId')}
                >
                  Next
                </LoadingButton>

                <Button
                  onClick={() => {
                    setNodeOperatorId(undefined);
                    handleNext();
                  }}
                  variant="outlined"
                >
                  Skip To Create Node Operator
                </Button>
              </Stack>
            </FormProvider>
          </Stack>
        );
      },
    },
    {
      label: 'Submit Your Validators',
      render: () => {
        return (
          <Stack direction="column" alignItems="start" className="step2" flexGrow={1}>
            <Typography variant="body1" mb={2}>
              You Have {selectedValidator.length} Validators, Validator Public Keys:
            </Typography>

            <Box
              sx={{
                maxWidth: 1,
                overflowY: 'auto',
              }}
            >
              {clusterNodeValidatorsGrouped.map((pks, index) => {
                const open = publicKeyOpens[index];

                return (
                  <Card sx={{ mb: 2 }} variant="outlined" key={index}>
                    <CardHeader
                      title={
                        <Stack direction="column" alignItems="start">
                          <Stack direction="row" alignItems="center">
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                setPublicKeyOpenByIndex(index);
                              }}
                            >
                              <Iconify icon={open ? 'mingcute:up-fill' : 'mingcute:down-fill'} />
                            </IconButton>
                            <Typography variant="h6">
                              Validator #{index * batchSize + 1}-#{index * batchSize + pks.length}
                            </Typography>
                          </Stack>
                          {!!bondValues[index] && (
                            <Typography variant="body2">
                              Required ETH: {formatEther(bondValues[index])}
                            </Typography>
                          )}
                        </Stack>
                      }
                      color="text.primary"
                      sx={{ px: 2, py: 2 }}
                      action={
                        <LoadingButton
                          fullWidth
                          color="primary"
                          size="large"
                          type="submit"
                          variant="soft"
                          loading={runningValidatorIndex === index}
                          disabled={runningValidatorIndex !== null || successIndex.includes(index)}
                          onClick={() => {
                            onRunValidatorClick(index);
                          }}
                        >
                          {successIndex.includes(index) ? 'Success' : 'Submit Keys'}
                        </LoadingButton>
                      }
                    />

                    <Collapse in={open}>
                      {pks.map((pk, jIndex) => (
                        <ValidatorBeachonLink pk={pk.pubkey} key={jIndex} />
                      ))}
                    </Collapse>
                  </Card>
                );
              })}
            </Box>

            <Stack direction="row" width={1} justifyContent="center">
              <LoadingButton
                sx={{ width: 300 }}
                color="primary"
                size="large"
                type="submit"
                variant="soft"
                disabled={successIndex.length !== clusterNodeValidatorsGrouped.length}
                disableRipple
                onClick={() => {
                  router.replace(config.routes.clusterValidator.home);
                }}
              >
                Finish
              </LoadingButton>
            </Stack>
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="md">
      <CommonBack />

      <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Typography variant="h3" textAlign="center" mt={4}>
          Confirm
          <Typography display="inline" variant="inherit" color="primary.main" px={1}>
            Lido CSM Registration
          </Typography>
        </Typography>

        <Card
          sx={{
            p: 4,
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" fontSize={20}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {/* <Typography>{step.description}</Typography> */}
                  {step.render()}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Stack>
    </Container>
  );
}
