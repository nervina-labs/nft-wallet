import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Box,
  NftImage,
  Text,
  HStack,
  Button,
  Input,
  Stack,
} from '@mibao-ui/components'
import {
  currentOrderInfoAtom,
  OrderStep,
  useSetOrderStep,
  useSetProductCount,
} from '../../hooks/useOrder'
import { useAtomValue } from 'jotai/utils'
import { formatCurrency } from '../../utils'
import { useNumberInput } from '@chakra-ui/react'

export const InitOrder = () => {
  const [t] = useTranslation('translations')
  const setOrderStep = useSetOrderStep()
  const setProductCount = useSetProductCount()

  const info = useAtomValue(currentOrderInfoAtom)

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: Math.min(info.limit || Infinity, info.remain || Infinity),
    precision: 0,
  })

  const onSumit = useCallback(() => {
    setProductCount(Number(value))
    setOrderStep(OrderStep.PaymentChannel)
  }, [setOrderStep, setProductCount, value])

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps({})
  return (
    <>
      <Box flexDirection="column">
        <Flex className="card" mt="12px" mb="30px">
          <NftImage
            resizeScale={200}
            type={info.type}
            src={info.coverUrl}
            width="120px"
            height="120px"
            borderRadius="22px"
          />
          <Stack direction="column" justifyContent="space-between" ml="16px">
            <Box flex={1}>
              <Text className="name" fontWeight={600} noOfLines={3}>
                {info.name}
              </Text>
            </Box>
            <Flex flexDirection="column" mt="auto">
              {info.remain ? (
                <Text color="gray.500" fontSize="12px">
                  {t('orders.drawer.remain', { remain: info.remain })}
                </Text>
              ) : null}
              <Text fontWeight="bold">
                {formatCurrency(info.price, info.currency)}
              </Text>
            </Flex>
          </Stack>
        </Flex>
        <Flex
          className="count"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text>{t('orders.drawer.count')}</Text>
          <HStack spacing={0} width="160px">
            <Button {...dec} borderLeftRadius="10px" borderRightRadius={0}>
              -
            </Button>
            <Input
              {...input}
              variant="filled"
              margin={0}
              borderRadius={0}
              textAlign="center"
              bg="#f6f6f6"
            />
            <Button
              {...inc}
              margin={0}
              borderRightRadius="10px"
              borderLeftRadius={0}
              width="60px"
            >
              +
            </Button>
          </HStack>
        </Flex>
        {info.limit ? (
          <Box
            bg="rgba(255, 206, 166, 0.1)"
            color="#FF5C00"
            px="8px"
            py="10px"
            fontSize="12px"
          >
            {t('orders.drawer.limit', { limit: info.limit })}
          </Box>
        ) : null}
      </Box>
      <footer className="footer">
        <Button
          colorScheme="primary"
          variant="solid"
          onClick={onSumit}
          type="submit"
          isFullWidth
        >
          {t('orders.drawer.submit')}
        </Button>
      </footer>
    </>
  )
}
